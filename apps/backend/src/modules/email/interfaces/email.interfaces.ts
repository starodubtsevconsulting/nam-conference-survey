export interface EmailConfirmationRequest {
  recipientEmail: string;
  submissionId: string;
  surveyName: string;
  submissionTimestamp: Date;
  resultsTimeline: string;
  resultsUrl: string;
  contactEmail: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  from: {
    email: string;
    name: string;
  };
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  attemptedAt: Date;
}

export interface EmailQueueJob {
  request: EmailConfirmationRequest;
  attempt: number;
}
