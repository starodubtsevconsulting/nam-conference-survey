import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { Role, Status } from '@prisma/client';
import { EmailQueueJob } from '../email/interfaces/email.interfaces';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);
  private readonly ANONYMOUS_EMAIL = 'anonymous@survey.local';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue<EmailQueueJob>,
  ) {}

  /**
   * Get or create the anonymous user for survey submissions
   */
  private async getOrCreateAnonymousUser() {
    let user = await this.prisma.user.findUnique({
      where: { email: this.ANONYMOUS_EMAIL },
    });

    if (!user) {
      this.logger.log('Creating anonymous user');
      user = await this.prisma.user.create({
        data: {
          email: this.ANONYMOUS_EMAIL,
          name: 'Anonymous Survey User',
          role: Role.PARTICIPANT,
        },
      });
    }

    return user;
  }

  /**
   * Check if the submission has at least one field filled
   */
  private hasAnyFieldFilled(dto: CreateSurveyResponseDto): boolean {
    const values = Object.values(dto);
    return values.some((value) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    });
  }

  /**
   * Submit anonymous survey response
   */
  async submitSurvey(dto: CreateSurveyResponseDto): Promise<SurveyResponseDto> {
    // Validate that at least one field is filled
    if (!this.hasAnyFieldFilled(dto)) {
      throw new BadRequestException(
        'Cannot submit empty survey. Please answer at least one question.',
      );
    }

    // Get or create anonymous user and create response in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Get or create anonymous user
      let user = await tx.user.findUnique({
        where: { email: this.ANONYMOUS_EMAIL },
      });

      if (!user) {
        this.logger.log('Creating anonymous user in transaction');
        user = await tx.user.create({
          data: {
            email: this.ANONYMOUS_EMAIL,
            name: 'Anonymous Survey User',
            role: Role.PARTICIPANT,
          },
        });
      }

      // Create survey response with default empty arrays for multi-select fields
      const response = await tx.surveyResponse.create({
        data: {
          userId: user.id,
          status: Status.SUBMITTED,

          // Email for confirmation (optional)
          email: dto.email ?? null,

          // Likert scale questions
          q1OverallRating: dto.q1OverallRating ?? null,
          q1Comment: dto.q1Comment ?? null,
          q2ReturnIntent: dto.q2ReturnIntent ?? null,
          q2Comment: dto.q2Comment ?? null,
          q3CoworkingEffectiveness: dto.q3CoworkingEffectiveness ?? null,
          q3Comment: dto.q3Comment ?? null,
          q5ConnectionDepth: dto.q5ConnectionDepth ?? null,
          q5Comment: dto.q5Comment ?? null,
          q6LearningValue: dto.q6LearningValue ?? null,
          q6Comment: dto.q6Comment ?? null,
          q8SaturdayWorth: dto.q8SaturdayWorth ?? null,
          q8Comment: dto.q8Comment ?? null,
          q9PreConferenceCommunication:
            dto.q9PreConferenceCommunication ?? null,
          q10AccommodationsVenue: dto.q10AccommodationsVenue ?? null,
          q13ComparisonToPD: dto.q13ComparisonToPD ?? null,

          // Multiple select questions (default to empty arrays)
          q4ConnectionTypes: dto.q4ConnectionTypes ?? [],
          q4ConnectionOther: dto.q4ConnectionOther ?? null,
          q17FeedbackConfidence: dto.q17FeedbackConfidence ?? [],

          // Ranking question
          q11SessionRankings: dto.q11SessionRankings || undefined,

          // Single choice questions
          q12ConferenceLength: dto.q12ConferenceLength ?? null,
          q16Improvements: dto.q16Improvements ?? null,
          q16Comment: dto.q16Comment ?? null,

          // Open-ended questions
          q7FutureTopics: dto.q7FutureTopics ?? null,
          q14LikedMost: dto.q14LikedMost ?? null,
          q15AdditionalFeedback: dto.q15AdditionalFeedback ?? null,

          // Demographics
          q18EmploymentStatus: dto.q18EmploymentStatus ?? null,
          q19Name: dto.q19Name ?? null,
          q19Location: dto.q19Location ?? null,
        },
      });

      return response;
    });

    // Log submission (without PII)
    this.logger.log(`Survey submitted: ${result.id}`);

    // Queue confirmation email if email was provided
    let emailQueued = false;
    if (result.email) {
      try {
        await this.queueConfirmationEmail(result.id, result.email, result.createdAt);
        emailQueued = true;
        this.logger.log(`Confirmation email queued for submission: ${result.id}`);
      } catch (error) {
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(
          `Failed to queue confirmation email for submission: ${result.id}`,
          errorStack,
        );
        // Don't throw - email failure shouldn't block survey submission
      }
    }

    // Get results URL from config
    const resultsUrl = this.configService.get<string>(
      'RESULTS_URL',
      'https://equalexperts.com/nam-conference-results',
    );

    // Return response DTO
    return new SurveyResponseDto(
      result.id,
      result.userId,
      result.status,
      result.createdAt,
      emailQueued,
      resultsUrl,
    );
  }

  /**
   * Queue confirmation email for sending
   */
  private async queueConfirmationEmail(
    submissionId: string,
    email: string,
    submissionTimestamp: Date,
  ): Promise<void> {
    const jobData: EmailQueueJob = {
      request: {
        recipientEmail: email,
        submissionId,
        surveyName: this.configService.get<string>('SURVEY_NAME', 'NAM Conference 2025 Feedback'),
        submissionTimestamp,
        resultsTimeline: this.configService.get<string>(
          'RESULTS_TIMELINE',
          'Survey results will be published after the conference on December 15, 2025.',
        ),
        resultsUrl: this.configService.get<string>(
          'RESULTS_URL',
          'https://equalexperts.com/nam-conference-results',
        ),
        contactEmail: this.configService.get<string>(
          'CONTACT_EMAIL',
          'nam-conference@equalexperts.com',
        ),
      },
      attempt: 1,
    };

    await this.emailQueue.add('send-confirmation', jobData, {
      priority: 1,
      delay: 0, // Send immediately
    });
  }

  /**
   * Resend confirmation email for a submission
   */
  async resendConfirmationEmail(submissionId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Fetch submission
      const submission = await this.prisma.surveyResponse.findUnique({
        where: { id: submissionId },
      });

      if (!submission) {
        throw new BadRequestException('Submission not found');
      }

      if (!submission.email) {
        throw new BadRequestException('No email address associated with this submission');
      }

      // Queue confirmation email
      await this.queueConfirmationEmail(submission.id, submission.email, submission.createdAt);

      this.logger.log(`Confirmation email re-queued for submission: ${submissionId}`);

      return {
        success: true,
        message: 'Confirmation email has been queued for resending',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to resend confirmation email for ${submissionId}`, errorStack);
      throw new BadRequestException('Failed to resend confirmation email');
    }
  }
}
