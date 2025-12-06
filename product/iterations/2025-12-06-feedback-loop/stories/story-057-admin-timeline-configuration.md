# User Story: Admin Timeline Configuration

**Story ID**: 057
**Iteration**: 2025-12-06-feedback-loop
**Priority**: Should have
**Status**: Draft
**Labels**: 2025-12-06-feedback-loop, organizer, admin, configuration, llm-dev

## User Story
As an Event Organizer/Admin,
I want to set expected results publication dates,
So that attendees receive accurate information about when to expect results.

## Context
Conference organizers need flexibility to configure when results will be published and customize messaging shown to attendees. This allows them to set realistic expectations, personalize communication, and update timelines if circumstances change. Admin control over these settings ensures accuracy and reduces manual coordination.

## Source
**Discovery Cycle**: 2025-12-06-feedback-loop
**GitHub Issue**: #7 - https://github.com/starodubtsevconsulting/nam-conference-survey/issues/7
**User Need**: Admin configurability for results timeline and messaging
**Supporting Evidence**: Organizer need for flexible timeline management

## Acceptance Criteria

### Functional Scenarios

**Scenario 1: Timeline Field in Setup Interface**
- **Given** an Admin is setting up or editing a survey
- **When** they access the event/survey setup interface
- **Then** a field for "Results Available By" date is present
- **And** the field accepts a date input (date picker)
- **And** the field can accept a text description (e.g., "After the conference")
- **And** the field is clearly labeled and explained

**Scenario 2: Custom Confirmation Message**
- **Given** an Admin is configuring survey settings
- **When** they access the confirmation message section
- **Then** they can personalize the message displayed upon survey completion
- **And** a text editor or textarea is provided for customization
- **And** a preview of the default message is shown
- **And** character limits (if any) are clearly indicated

**Scenario 3: Custom Feedback Impact Statement**
- **Given** an Admin is configuring survey settings
- **When** they access the impact statement section
- **Then** they can create a tailored explanation of "How feedback will be used"
- **And** a text editor is provided with formatting options (if applicable)
- **And** guidance or examples are provided for writing effective statements
- **And** the admin can include specific examples of past changes

**Scenario 4: Preview Functionality**
- **Given** an Admin has configured confirmation details
- **When** they want to see how it appears to participants
- **Then** a "Preview" button or option is available
- **And** clicking preview shows the confirmation page as attendees will see it
- **And** the preview includes the custom message, timeline, and impact statement
- **And** the preview is accurate and reflects current settings

**Scenario 5: Timeline Updates After Publication**
- **Given** an Admin has already published a survey with a results timeline
- **When** circumstances change and they need to update the timeline
- **Then** the admin can edit the "Results Available By" date
- **And** saving the updated date updates all associated messaging
- **And** attendees see the updated timeline on the confirmation page
- **And** optionally, participants are notified of the timeline change

**Scenario 6: Default Values Provided**
- **Given** an Admin is creating a new survey
- **When** they access timeline and messaging fields
- **Then** sensible default values are pre-populated
- **And** defaults include generic but professional messaging
- **And** admins can use defaults as-is or customize them
- **And** defaults follow Equal Experts tone and branding

**Scenario 7: Validation and Safeguards**
- **Given** an Admin is entering configuration data
- **When** they attempt to save invalid or incomplete data
- **Then** validation errors are displayed clearly
- **And** required fields are indicated (if any)
- **And** date fields validate that dates are in the future
- **And** helpful error messages guide correction

### Non-Functional Requirements
- [ ] Usability: Admin interface is intuitive and easy to use
- [ ] Flexibility: Supports various timeline formats (dates, text descriptions)
- [ ] Validation: Prevents invalid configurations
- [ ] Preview: Accurate representation of attendee experience
- [ ] Performance: Settings save quickly (< 2 seconds)

### Quality Checklist
- [ ] All configuration fields work correctly
- [ ] Preview accurately reflects settings
- [ ] Timeline updates propagate to confirmation page
- [ ] Default values are professional and appropriate
- [ ] Validation prevents common errors
- [ ] Admin interface tested with real organizer feedback
- [ ] Mobile-friendly admin interface (if applicable)
- [ ] Help text and guidance are clear

## Open Questions
- Where does the admin interface live (existing admin page, new settings panel)?
- Should admins be able to schedule timeline changes in advance?
- What permissions are required to modify these settings?
- Should there be version history or audit log of configuration changes?
- How are changes to live surveys handled (immediate or on next response)?
- Should timeline updates trigger notifications to past participants?
- Can different surveys have different timelines/messaging?

## Dependencies
- Admin interface or dashboard (Story 045 - Admin Overview, or new admin settings page)
- Confirmation page that reads from configuration (Story 052)
- Impact statement display logic (Story 055)
- Database schema for storing survey configuration
- Admin authentication/authorization

## Estimate
**Size**: M (3-5 days)
**Confidence**: Medium

**Reasoning**: Requires building or extending admin interface with configuration forms, preview functionality, and database storage for settings. Moderate complexity in UI/UX for admin configuration and ensuring settings propagate correctly to attendee-facing pages. If admin infrastructure exists (Story 045), integration is straightforward. If admin panel needs to be built from scratch, estimate increases.

## Metadata
**Iteration**: 2025-12-06-feedback-loop
**Created**: 2025-12-06
**Last Updated**: 2025-12-06
**Build Date**: [To be populated when status changes to Built]