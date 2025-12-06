import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from '../email.service';
import { EmailQueueJob } from '../interfaces/email.interfaces';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-confirmation')
  async handleSendConfirmation(job: Job<EmailQueueJob>) {
    const { request, attempt } = job.data;

    this.logger.log(
      `Processing email confirmation for ${request.recipientEmail} (attempt ${attempt})`,
    );

    try {
      const result = await this.emailService.sendConfirmationEmail(request);

      if (!result.success) {
        // Throw error to trigger retry mechanism
        throw new Error(result.error || 'Email sending failed');
      }

      this.logger.log(
        `Email confirmation sent successfully to ${request.recipientEmail} (messageId: ${result.messageId})`,
      );

      return result;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send email confirmation to ${request.recipientEmail} (attempt ${attempt})`,
        errorStack,
      );

      // Bull will automatically retry based on the configuration
      throw error;
    }
  }
}
