import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailConfirmationRequest } from './interfaces/email.interfaces';
import { EmailStatus } from '@prisma/client';

describe('EmailService', () => {
  let service: EmailService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    emailDeliveryLog: {
      create: jest.fn(),
    },
    surveyResponse: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, string> = {
        EMAIL_PROVIDER: 'ethereal',
        SURVEY_NAME: 'NAM Conference 2025 Feedback',
        RESULTS_TIMELINE: 'Survey results will be published after the conference on December 15, 2025.',
        RESULTS_URL: 'https://equalexperts.com/nam-conference-results',
        CONTACT_EMAIL: 'nam-conference@equalexperts.com',
        EMAIL_FROM_ADDRESS: 'noreply@equalexperts.com',
        EMAIL_FROM_NAME: 'Equal Experts NAM Conference',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendConfirmationEmail', () => {
    const mockRequest: EmailConfirmationRequest = {
      recipientEmail: 'test@example.com',
      submissionId: 'test-submission-id',
      surveyName: 'NAM Conference 2025 Feedback',
      submissionTimestamp: new Date('2025-12-06T12:00:00Z'),
      resultsTimeline: 'Survey results will be published after the conference on December 15, 2025.',
      resultsUrl: 'https://equalexperts.com/nam-conference-results',
      contactEmail: 'nam-conference@equalexperts.com',
    };

    it('should log delivery attempt to database on success', async () => {
      mockPrismaService.emailDeliveryLog.create.mockResolvedValue({
        id: 'log-id',
        surveyResponseId: mockRequest.submissionId,
        recipientEmail: mockRequest.recipientEmail,
        status: EmailStatus.SENT,
        messageId: 'message-id',
        error: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.sendConfirmationEmail(mockRequest);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(mockPrismaService.emailDeliveryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            surveyResponseId: mockRequest.submissionId,
            recipientEmail: mockRequest.recipientEmail,
            status: EmailStatus.SENT,
          }),
        }),
      );
    });

    it('should log delivery failure to database on error', async () => {
      mockPrismaService.emailDeliveryLog.create.mockResolvedValue({
        id: 'log-id',
        surveyResponseId: mockRequest.submissionId,
        recipientEmail: mockRequest.recipientEmail,
        status: EmailStatus.FAILED,
        messageId: null,
        error: 'Connection refused',
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Force error by mocking transporter to throw
      const mockTransporter = {
        sendMail: jest.fn().mockRejectedValue(new Error('Connection refused')),
      };
      (service as any).transporter = mockTransporter;

      const result = await service.sendConfirmationEmail(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection refused');
      expect(mockPrismaService.emailDeliveryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            surveyResponseId: mockRequest.submissionId,
            recipientEmail: mockRequest.recipientEmail,
            status: EmailStatus.FAILED,
            error: 'Connection refused',
          }),
        }),
      );
    });
  });

  describe('resendConfirmationEmail', () => {
    it('should throw error if submission not found', async () => {
      mockPrismaService.surveyResponse.findUnique.mockResolvedValue(null);

      await expect(
        service.resendConfirmationEmail('non-existent-id'),
      ).rejects.toThrow('Submission not found or email not provided');
    });

    it('should throw error if submission has no email', async () => {
      mockPrismaService.surveyResponse.findUnique.mockResolvedValue({
        id: 'test-id',
        email: null,
        createdAt: new Date(),
      });

      await expect(
        service.resendConfirmationEmail('test-id'),
      ).rejects.toThrow('Submission not found or email not provided');
    });

    it('should resend email if submission exists with email', async () => {
      const mockSubmission = {
        id: 'test-id',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      mockPrismaService.surveyResponse.findUnique.mockResolvedValue(mockSubmission);
      mockPrismaService.emailDeliveryLog.create.mockResolvedValue({
        id: 'log-id',
        surveyResponseId: mockSubmission.id,
        recipientEmail: mockSubmission.email,
        status: EmailStatus.SENT,
        messageId: 'resend-message-id',
        error: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.resendConfirmationEmail(mockSubmission.id);

      expect(result.success).toBe(true);
      expect(mockPrismaService.surveyResponse.findUnique).toHaveBeenCalledWith({
        where: { id: mockSubmission.id },
      });
    });
  });
});
