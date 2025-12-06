# User Story: Email Confirmation with Timeline

**Story ID**: 053
**Iteration**: 2025-12-06-feedback-loop
**Priority**: Should have
**Status**: Draft
**Labels**: 2025-12-06-feedback-loop, attendee, email-notification, feedback-loop, llm-dev

## User Story
As an Attendee,
I want to receive an email confirmation after submitting feedback,
So that I maintain a record of submission and understand when to expect results.

## Context
After completing a survey, attendees benefit from an email confirmation that serves as both a receipt and a reminder of when results will be available. This email provides a tangible record outside the web application and ensures attendees don't need to remember the results URL.

## Source
**Discovery Cycle**: 2025-12-06-feedback-loop
**GitHub Issue**: #3 - https://github.com/starodubtsevconsulting/nam-conference-survey/issues/3
**User Need**: Persistent confirmation and timeline communication via email
**Supporting Evidence**: Attendee need for submission records and results access reminders

## Acceptance Criteria

### Functional Scenarios

**Scenario 1: Timely Email Delivery**
- **Given** an Attendee has successfully submitted survey feedback
- **When** the submission is confirmed by the system
- **Then** a confirmation email is sent to the attendee
- **And** the email is delivered within 5 minutes of form submission
- **And** the email appears in the attendee's inbox (not spam)

**Scenario 2: Submission Details Included**
- **Given** an Attendee receives the confirmation email
- **When** they open and read the email
- **Then** the email includes the survey/feedback name clearly displayed
- **And** the email shows the submission timestamp
- **And** the content confirms which survey was completed

**Scenario 3: Results Timeline Communication**
- **Given** an Attendee receives the confirmation email
- **When** they read the timeline information
- **Then** the email provides the expected timeline for results publication
- **And** the timeline is specific (date or timeframe like "after the conference")
- **And** the timeline matches what was shown on the confirmation page

**Scenario 4: Contact Information Available**
- **Given** an Attendee has questions about their submission
- **When** they check the confirmation email
- **Then** contact information for participant inquiries is included
- **And** the contact method is clear (email address or support link)
- **And** the purpose of the contact info is explained

**Scenario 5: Results Access Link**
- **Given** an Attendee receives the confirmation email
- **When** they want to access results later
- **Then** the email contains a functional link to access results
- **And** the link directs to the results page (e.g., equalexperts.com/nam-conference-results)
- **And** the link purpose is clearly labeled

**Scenario 6: Email Not Received**
- **Given** an Attendee submitted feedback but didn't receive confirmation email
- **When** they check their inbox after 10 minutes
- **Then** they can request a resend via the application
- **Or** they can check their spam/junk folder
- **And** help text on confirmation page mentions checking spam

**Scenario 7: Anonymous Survey Email Handling**
- **Given** the survey is anonymous (no authentication required)
- **When** an attendee submits feedback
- **Then** the system handles email collection appropriately
- **And** email collection is optional if truly anonymous
- **Or** email is requested only for confirmation purposes with clear opt-in

### Non-Functional Requirements
- [ ] Performance: Email sent within 5 minutes of submission
- [ ] Reliability: Email delivery success rate > 95%
- [ ] Security: Email addresses stored securely and not shared
- [ ] Privacy: Clear statement about email usage (confirmation only)
- [ ] Deliverability: SPF/DKIM configured to avoid spam folders

### Quality Checklist
- [ ] Email template follows Equal Experts branding
- [ ] All required information included (submission details, timeline, link, contact)
- [ ] Email renders correctly on desktop and mobile email clients
- [ ] Links in email are functional and tested
- [ ] Email delivery tested with major providers (Gmail, Outlook, etc.)
- [ ] Spam score checked and optimized
- [ ] Plain text fallback available for email

## Open Questions
- How are email addresses collected for anonymous surveys?
- Should email be optional or required for confirmation?
- What email service/provider should be used (SendGrid, AWS SES, etc.)?
- What contact information should be provided (support email, organizer email)?
- Should we track email opens/clicks for analytics?
- What happens if email delivery fails?

## Dependencies
- Email service integration (SendGrid, AWS SES, or similar)
- Email templates designed with Equal Experts branding
- Email address collection mechanism (if not already captured)
- SMTP/email service configuration
- Results URL must be determined (from Story 052)
- Contact information for inquiries

## Estimate
**Size**: M (3-5 days)
**Confidence**: Medium

**Reasoning**: Requires email service integration, template design, and email delivery infrastructure. Complexity includes ensuring deliverability, handling edge cases (bounces, spam), and testing across email clients. If email infrastructure already exists, could be smaller (S). If needs full email service setup, could be larger.

## Metadata
**Iteration**: 2025-12-06-feedback-loop
**Created**: 2025-12-06
**Last Updated**: 2025-12-06
**Build Date**: [To be populated when status changes to Built]