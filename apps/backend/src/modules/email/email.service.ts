import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import {
  EmailConfirmationRequest,
  EmailTemplate,
  EmailDeliveryResult,
} from './interfaces/email.interfaces';
import { EmailStatus } from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;
  private htmlTemplate!: HandlebarsTemplateDelegate;
  private textTemplate!: HandlebarsTemplateDelegate;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  /**
   * Initialize nodemailer transporter based on environment configuration
   */
  private initializeTransporter() {
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER', 'ethereal');

    if (emailProvider === 'ethereal' || process.env.NODE_ENV === 'development') {
      // Use Ethereal Email for development/testing
      this.logger.log('Initializing Ethereal Email for development');
      // Note: For production, this should be replaced with actual transporter setup
      // This is a placeholder that will be configured during first send
    } else if (emailProvider === 'smtp') {
      // Generic SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: this.configService.get<boolean>('SMTP_SECURE', false),
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
      this.logger.log('Initialized SMTP transporter');
    }
    // Additional providers (AWS SES, SendGrid) can be added here
  }

  /**
   * Load and compile Handlebars templates
   */
  private loadTemplates() {
    try {
      // In development, __dirname points to dist, but templates are in src
      // In production, templates should be copied to dist
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const templateDir = isDevelopment
        ? path.join(process.cwd(), 'src', 'modules', 'email', 'templates')
        : path.join(__dirname, 'templates');

      const htmlTemplatePath = path.join(templateDir, 'confirmation.html.hbs');
      const textTemplatePath = path.join(templateDir, 'confirmation.text.hbs');

      const htmlSource = fs.readFileSync(htmlTemplatePath, 'utf-8');
      const textSource = fs.readFileSync(textTemplatePath, 'utf-8');

      this.htmlTemplate = handlebars.compile(htmlSource);
      this.textTemplate = handlebars.compile(textSource);

      this.logger.log('Email templates loaded successfully');
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to load email templates', errorStack);
      throw error;
    }
  }

  /**
   * Render email template with provided data
   */
  private renderTemplate(request: EmailConfirmationRequest): EmailTemplate {
    const templateData = {
      surveyName: request.surveyName,
      submissionTimestamp: request.submissionTimestamp.toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/New_York',
      }),
      submissionId: request.submissionId,
      resultsTimeline: request.resultsTimeline,
      resultsUrl: request.resultsUrl,
      contactEmail: request.contactEmail,
    };

    return {
      subject: `${request.surveyName} - Confirmation of Submission`,
      html: this.htmlTemplate(templateData),
      text: this.textTemplate(templateData),
      from: {
        email: this.configService.get<string>('EMAIL_FROM_ADDRESS', 'noreply@equalexperts.com'),
        name: this.configService.get<string>('EMAIL_FROM_NAME', 'Equal Experts NAM Conference'),
      },
    };
  }

  /**
   * Send confirmation email
   */
  async sendConfirmationEmail(
    request: EmailConfirmationRequest,
  ): Promise<EmailDeliveryResult> {
    const attemptedAt = new Date();

    try {
      // Ensure transporter is initialized (for Ethereal in development)
      if (!this.transporter) {
        await this.initializeEtherealTransporter();
      }

      // Render email template
      const template = this.renderTemplate(request);

      // Send email
      const info = await this.transporter.sendMail({
        from: `"${template.from.name}" <${template.from.email}>`,
        to: request.recipientEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);

      // Log preview URL for Ethereal (development only)
      if (process.env.NODE_ENV === 'development') {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      // Log delivery to database
      await this.logDelivery(
        request.submissionId,
        request.recipientEmail,
        EmailStatus.SENT,
        info.messageId,
        null,
        attemptedAt,
      );

      return {
        success: true,
        messageId: info.messageId,
        attemptedAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to send email', errorStack);

      // Log failure to database
      await this.logDelivery(
        request.submissionId,
        request.recipientEmail,
        EmailStatus.FAILED,
        null,
        errorMessage,
        attemptedAt,
      );

      return {
        success: false,
        error: errorMessage,
        attemptedAt,
      };
    }
  }

  /**
   * Initialize Ethereal Email transporter for development
   */
  private async initializeEtherealTransporter() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log('Initialized Ethereal Email transporter for development');
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to initialize Ethereal transporter', errorStack);
      throw error;
    }
  }

  /**
   * Log email delivery attempt to database
   */
  private async logDelivery(
    submissionId: string,
    recipientEmail: string,
    status: EmailStatus,
    messageId: string | null,
    error: string | null,
    attemptedAt: Date,
  ): Promise<void> {
    try {
      await this.prisma.emailDeliveryLog.create({
        data: {
          surveyResponseId: submissionId,
          recipientEmail,
          status,
          messageId,
          error,
          sentAt: status === EmailStatus.SENT ? attemptedAt : null,
        },
      });
    } catch (dbError) {
      const errorStack = dbError instanceof Error ? dbError.stack : undefined;
      this.logger.error('Failed to log email delivery to database', errorStack);
      // Don't throw - we don't want DB logging failures to break email sending
    }
  }

  /**
   * Resend confirmation email for a given submission
   */
  async resendConfirmationEmail(submissionId: string): Promise<EmailDeliveryResult> {
    try {
      // Fetch submission details
      const submission = await this.prisma.surveyResponse.findUnique({
        where: { id: submissionId },
      });

      if (!submission || !submission.email) {
        throw new Error('Submission not found or email not provided');
      }

      // Create request object
      const request: EmailConfirmationRequest = {
        recipientEmail: submission.email,
        submissionId: submission.id,
        surveyName: this.configService.get<string>('SURVEY_NAME', 'NAM Conference 2025 Feedback'),
        submissionTimestamp: submission.createdAt,
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
      };

      return await this.sendConfirmationEmail(request);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to resend email for submission ${submissionId}`, errorStack);
      return {
        success: false,
        error: errorMessage,
        attemptedAt: new Date(),
      };
    }
  }
}
