import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SurveyService } from './survey.service';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { SurveyResponseDto } from './dto/survey-response.dto';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  /**
   * POST /api/survey/submit
   * Submit anonymous survey response
   * Rate limited to 10 submissions per hour per IP
   */
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 requests per hour
  async submitSurvey(
    @Body() createSurveyResponseDto: CreateSurveyResponseDto,
  ): Promise<SurveyResponseDto> {
    return this.surveyService.submitSurvey(createSurveyResponseDto);
  }

  /**
   * POST /api/survey/:submissionId/resend-confirmation
   * Resend confirmation email for a submission
   * Rate limited to prevent abuse
   */
  @Post(':submissionId/resend-confirmation')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
  async resendConfirmation(
    @Param('submissionId') submissionId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.surveyService.resendConfirmationEmail(submissionId);
  }
}
