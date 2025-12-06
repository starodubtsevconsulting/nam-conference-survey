export class SurveyResponseDto {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  message: string;
  emailSent?: boolean;
  resultsUrl?: string;

  constructor(
    id: string,
    userId: string,
    status: string,
    createdAt: Date,
    emailSent?: boolean,
    resultsUrl?: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.status = status.toLowerCase();
    this.createdAt = createdAt.toISOString();
    this.message = 'Survey submitted successfully';
    this.emailSent = emailSent;
    this.resultsUrl = resultsUrl;
  }
}
