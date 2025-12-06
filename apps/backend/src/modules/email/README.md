# Email Confirmation Module

This module implements email confirmation functionality for the NAM Conference Survey, sending confirmation emails to attendees after they submit survey feedback.

## Features

- **Asynchronous Email Sending**: Uses Bull queue with Redis for non-blocking email delivery
- **Retry Logic**: Automatic retry with exponential backoff (3 attempts: 1min, 5min, 15min)
- **Email Templates**: Handlebars templates with Equal Experts branding (HTML + plain text)
- **Delivery Tracking**: Database logging of all email delivery attempts
- **Multiple Providers**: Support for Ethereal (dev), SMTP, SendGrid, AWS SES
- **Resend Capability**: API endpoint to resend confirmation emails

## Architecture

```
EmailModule
├── email.service.ts          # Core email service (sending, templating)
├── email.module.ts            # Module configuration
├── processors/
│   └── email.processor.ts    # Bull queue processor for async sending
├── interfaces/
│   └── email.interfaces.ts   # TypeScript interfaces
└── templates/
    ├── confirmation.html.hbs # HTML email template
    └── confirmation.text.hbs # Plain text email template
```

## Database Schema

### SurveyResponse (updated)
- `email` (String?, optional): Email address for confirmation

### EmailDeliveryLog (new)
- `id` (String): Unique identifier
- `surveyResponseId` (String): Reference to survey submission
- `recipientEmail` (String): Email address
- `status` (EmailStatus): PENDING | SENT | FAILED | BOUNCED
- `messageId` (String?): Email provider's message ID
- `error` (String?): Error message if failed
- `sentAt` (DateTime?): Timestamp when email was sent
- `createdAt` (DateTime): Log creation timestamp
- `updatedAt` (DateTime): Last update timestamp

## Configuration

### Environment Variables

Required:
```bash
# Redis (for email queue)
REDIS_HOST=redis
REDIS_PORT=6379

# Email provider (ethereal, smtp, sendgrid, ses)
EMAIL_PROVIDER=ethereal

# Survey configuration
SURVEY_NAME=NAM Conference 2025 Feedback
RESULTS_TIMELINE=Survey results will be published after the conference on December 15, 2025.
RESULTS_URL=https://equalexperts.com/nam-conference-results
CONTACT_EMAIL=nam-conference@equalexperts.com
EMAIL_FROM_ADDRESS=noreply@equalexperts.com
EMAIL_FROM_NAME=Equal Experts NAM Conference
```

Optional (provider-specific):
```bash
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password

# SendGrid Configuration
SENDGRID_API_KEY=your-api-key

# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## API Endpoints

### Submit Survey with Email
```http
POST /api/survey/submit
Content-Type: application/json

{
  "email": "attendee@example.com",  // Optional
  "q1OverallRating": 5,
  // ... other survey fields
}
```

Response:
```json
{
  "id": "uuid-123",
  "userId": "uuid-456",
  "status": "submitted",
  "createdAt": "2025-12-06T12:00:00.000Z",
  "message": "Survey submitted successfully",
  "emailSent": true,
  "resultsUrl": "https://equalexperts.com/nam-conference-results"
}
```

### Resend Confirmation Email
```http
POST /api/survey/:submissionId/resend-confirmation
```

Response:
```json
{
  "success": true,
  "message": "Confirmation email has been queued for resending"
}
```

## Email Flow

1. **Survey Submission**: User submits survey with optional email address
2. **Database Save**: Survey response saved with email field
3. **Queue Job**: Email job added to Bull queue immediately
4. **Async Processing**: Bull processor picks up job and calls EmailService
5. **Email Sending**: EmailService sends email via configured provider
6. **Delivery Logging**: Result logged to `email_delivery_logs` table
7. **Retry on Failure**: If sending fails, Bull automatically retries (3 attempts with exponential backoff)

```
┌─────────────────┐
│ Survey Submit   │
│ (with email)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Save to DB      │
│ (SurveyResponse)│
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Queue Email Job │
│ (Bull/Redis)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Email Processor │
│ (async)         │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Send Email      │
│ (NodeMailer)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Log Delivery    │
│ (EmailDelivLog) │
└─────────────────┘
```

## Email Templates

Templates use Handlebars with the following variables:
- `{{surveyName}}`: Name of the survey
- `{{submissionTimestamp}}`: Formatted submission date/time
- `{{submissionId}}`: Unique submission identifier
- `{{resultsTimeline}}`: When results will be available
- `{{resultsUrl}}`: Link to view results
- `{{contactEmail}}`: Contact email for questions

### Equal Experts Branding
- **Colors**: Primary Blue (#1795d4), Navy (#22567c), Charcoal (#2c3234)
- **Font**: Lexend (300, 400, 500 weights)
- **Logo**: https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg

## Development

### Using Ethereal Email (Default)
In development mode (`EMAIL_PROVIDER=ethereal`), emails are sent to Ethereal Email test accounts. Check the backend logs for preview URLs:

```
[EmailService] Preview URL: https://ethereal.email/message/xxxxx
```

### Running Tests
```bash
# Unit tests
docker-compose exec backend pnpm test email.service

# Watch mode
docker-compose exec backend pnpm test:watch email.service

# Coverage
docker-compose exec backend pnpm test:cov
```

### Viewing Email Queue
Bull queue jobs can be monitored using Bull Board or by connecting to Redis:

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# View queue length
LLEN bull:email:wait

# View failed jobs
LLEN bull:email:failed
```

## Production Setup

### 1. Choose Email Provider

**Option A: AWS SES (Recommended)**
- Cost-effective ($0.10 per 1,000 emails)
- Reliable and scalable
- Requires verified domain and email addresses

```bash
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

**Option B: SendGrid**
- Easy setup with API key
- Free tier: 100 emails/day
- Good deliverability tools

```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

**Option C: SMTP**
- Use any SMTP server
- Flexible but requires configuration

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### 2. Configure DNS Records

For optimal deliverability, configure:
- **SPF**: Add TXT record for sending domain
- **DKIM**: Configure DKIM signing (provider-specific)
- **DMARC**: Set DMARC policy

Example SPF record:
```
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

### 3. Monitor Deliverability

- Track email delivery success rate (target: >95%)
- Monitor bounce rate
- Check spam score using tools like Mail-Tester
- Set up alerts for high failure rates

## Troubleshooting

### Emails Not Sending

1. **Check Redis Connection**
   ```bash
   docker-compose exec backend nc -zv redis 6379
   ```

2. **Check Queue Status**
   ```bash
   docker-compose logs backend | grep "Email"
   ```

3. **Verify Environment Variables**
   ```bash
   docker-compose exec backend printenv | grep EMAIL
   ```

### High Bounce Rate

- Verify sender domain is authenticated (SPF/DKIM)
- Check email addresses for typos
- Ensure "From" address matches verified domain
- Review bounce logs in `email_delivery_logs` table

### Emails Going to Spam

- Run spam score test: https://www.mail-tester.com
- Ensure SPF, DKIM, DMARC are configured
- Avoid spam trigger words in templates
- Warm up sending domain gradually

## Future Enhancements

- [ ] Add email open/click tracking (with privacy considerations)
- [ ] Implement webhook handlers for bounces/complaints
- [ ] Support for multiple languages/localization
- [ ] Email template versioning
- [ ] Bull Board UI for queue monitoring
- [ ] Integration tests with email service providers
- [ ] Delivery analytics dashboard
