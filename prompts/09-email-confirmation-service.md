# Email Confirmation Service

Implement a backend email confirmation service that sends attendees a confirmation email after submitting survey feedback. The email serves as both a receipt of submission and a reminder of when results will be available, providing a tangible record outside the web application. This feature addresses the need for persistent confirmation and timeline communication via email for the anonymous NAM Conference Survey.

## Requirements

- Email must be sent within 5 minutes of successful survey submission
- Email delivery success rate must exceed 95%
- Email content must include:
  - Survey/feedback name clearly displayed
  - Submission timestamp
  - Expected timeline for results publication (specific date or timeframe)
  - Functional link to access results (e.g., equalexperts.com/nam-conference-results)
  - Contact information for participant inquiries
- Email template must follow Equal Experts branding guidelines
- Email must render correctly on desktop and mobile email clients
- Plain text fallback must be available for email clients that don't support HTML
- SPF/DKIM configuration must be implemented to avoid spam folders
- Email addresses must be stored securely and not shared
- Clear privacy statement about email usage (confirmation only)
- System must handle email delivery failures gracefully
- Support for resending confirmation emails if initial delivery fails


## Extra Considerations

- **Email Service Provider Selection**: Choose between SendGrid, AWS SES, or similar service based on cost, reliability, and deliverability features
- **Email Address Collection**: Since survey is anonymous, determine how email addresses are collected (optional field on survey form vs. separate opt-in)
- **Rate Limiting**: Consider rate limits imposed by email service provider to avoid throttling
- **Email Queue**: Implement asynchronous email sending using a job queue (e.g., Bull/BullMQ) to avoid blocking survey submission response
- **Retry Logic**: Implement exponential backoff retry logic for failed email deliveries
- **Email Deliverability Testing**: Test with major email providers (Gmail, Outlook, Yahoo, etc.) to ensure emails land in inbox, not spam
- **Spam Score Optimization**: Use tools like Mail-Tester to check and optimize spam score
- **Email Open/Click Tracking**: Decide whether to track email opens and clicks for analytics (consider privacy implications)
- **Bounce Handling**: Implement webhook handlers for bounce notifications from email service provider
- **Configuration Management**: Use ConfigModule for all email service credentials and settings (never hardcode)
- **Email Template Versioning**: Consider versioning email templates for future updates without breaking old emails
- **Localization**: Consider if email content needs to support multiple languages
- **GDPR/Privacy Compliance**: Ensure email storage and usage complies with privacy regulations
- **Testing in Development**: Use email testing tools like Ethereal Email or Mailtrap for development/testing environments

## Testing Considerations

### Unit Tests
- Test email template rendering with various inputs
- Test email service configuration validation
- Test retry logic with simulated failures
- Test email address validation
- Test edge cases (missing fields, invalid formats)

### Integration Tests
- Test email sending through actual email service provider in test mode
- Test webhook handlers for bounce/delivery notifications
- Test email queue job processing
- Test database logging of email delivery attempts
- Test resend functionality

### End-to-End Tests
- Test complete flow: survey submission → email sent → delivery logged
- Test email delivery failure scenarios and retry behavior
- Test resend confirmation email endpoint
- Test email rendering in actual email clients (manual testing or Email on Acid)

### Performance Tests
- Test email sending performance under load (100+ concurrent submissions)
- Verify email queue can handle burst traffic
- Measure time from submission to email delivery

### Quality Gates
- Minimum 80% code coverage for email service module
- All email templates must pass HTML validation
- Spam score must be below 5.0 (Mail-Tester)
- Email delivery success rate >95% in staging environment

## Implementation Notes

### Email Service Provider
- Recommend AWS SES for cost-effectiveness and reliability
- Alternative: SendGrid for easier setup and better deliverability tools
- Use official SDK/library for chosen provider

### Architecture
- Create dedicated `EmailModule` in NestJS
- Implement `EmailService` as a provider with dependency injection
- Use Bull/BullMQ for asynchronous job queue
- Store email templates in separate template files (not inline in code)
- Use a template engine like Handlebars for email rendering

### Database Schema
- Add `email` field to survey submission (optional, nullable)
- Create `email_delivery_log` table for tracking delivery attempts
- Consider adding `email_preferences` table for opt-out management

### Configuration
- Environment variables for email service credentials (AWS_SES_KEY, SENDGRID_API_KEY, etc.)
- Configuration for sender email address and name
- Configuration for results URL and contact email
- Development vs. production email service switching

### Equal Experts Branding
- Use Equal Experts color palette:
  - Primary Blue: `#1795d4`
  - Navy: `#22567c`
  - Charcoal: `#2c3234`
- Use Lexend font (load from Google Fonts in email)
- Include Equal Experts logo: `https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg`
- Follow responsive email best practices (mobile-first design)

### Error Handling
- Log all email delivery failures with detailed error messages
- Implement graceful degradation (survey submission succeeds even if email fails)
- Provide clear error messages for debugging
- Set up monitoring/alerts for email delivery failure rate

## Specification by Example

### Example 1: Successful Email Confirmation

**Given**: An attendee submits survey feedback with email `attendee@example.com`

**When**: Survey submission is successfully saved to database

**Then**:
- Email job is queued immediately
- Email is sent within 5 minutes
- Email delivery log is created with status `sent`
- Email contains:
  ```
  Subject: NAM Conference Survey - Confirmation of Submission

  From: Equal Experts NAM Conference <noreply@equalexperts.com>

  Body:
  ---
  Thank you for completing the NAM Conference Survey!

  Submission Details:
  - Survey: NAM Conference 2025 Feedback
  - Submitted: December 6, 2025 at 2:45 PM EST

  Results Timeline:
  Survey results will be published after the conference on December 15, 2025.

  Access Results:
  View the compiled results at: https://equalexperts.com/nam-conference-results

  Questions?
  Contact us at: nam-conference@equalexperts.com

  ---
  Equal Experts
  [Logo]
  ```

### Example 2: Email Delivery Failure with Retry

**Given**: Email service provider returns temporary failure (rate limit)

**When**: Initial email send fails

**Then**:
- Email delivery log status is set to `pending`
- Retry job is scheduled with exponential backoff (1 min, 5 min, 15 min)
- After 3 retry attempts, status is set to `failed`
- Error is logged for investigation
- Survey submission still succeeds (email failure doesn't block survey)

### Example 3: Resend Confirmation Email

**Given**: Attendee didn't receive initial email (spam folder, typo in email)

**When**: Attendee requests resend via confirmation page

**Then**:
- System looks up original submission by ID
- New email job is created with same content
- Email is resent to the same address
- New delivery log entry is created
- Response indicates email was resent successfully

## Verification

- [ ] Email module is created and properly integrated with NestJS dependency injection
- [ ] Email service provider is configured (AWS SES, SendGrid, etc.)
- [ ] SPF and DKIM records are configured for the sending domain
- [ ] Email templates are created with Equal Experts branding
- [ ] Email templates include all required information (survey name, timestamp, timeline, link, contact)
- [ ] Email templates render correctly on desktop email clients (Gmail, Outlook, Apple Mail)
- [ ] Email templates render correctly on mobile email clients
- [ ] Plain text fallback is implemented and tested
- [ ] Email sending is asynchronous (doesn't block survey submission response)
- [ ] Email queue is implemented using Bull/BullMQ or similar
- [ ] Email delivery logging is implemented in database
- [ ] Retry logic is implemented with exponential backoff
- [ ] Bounce/failure webhook handlers are implemented (if supported by provider)
- [ ] Survey submission endpoint accepts optional email field
- [ ] Survey submission succeeds even if email delivery fails
- [ ] Resend confirmation email endpoint is implemented
- [ ] Email delivery time is within 5 minutes (tested under normal load)
- [ ] Email deliverability is >95% in staging environment
- [ ] Spam score is below 5.0 (verified with Mail-Tester)
- [ ] Unit tests cover email template rendering
- [ ] Unit tests cover retry logic
- [ ] Integration tests cover email sending through provider
- [ ] Integration tests cover webhook handlers
- [ ] E2E tests cover complete submission-to-email flow
- [ ] Performance tests verify email queue handles burst traffic
- [ ] Code coverage is >80% for email module
- [ ] Email addresses are stored securely (encrypted if applicable)
- [ ] Privacy statement about email usage is included in email template
- [ ] Configuration uses ConfigModule (no hardcoded credentials)
- [ ] Development environment uses email testing tool (Ethereal/Mailtrap)
- [ ] Production monitoring/alerts are configured for email delivery failures
- [ ] Documentation is updated with email service configuration instructions
