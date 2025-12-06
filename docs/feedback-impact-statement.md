# Feedback Impact Statement Documentation

**Story**: #055 - Feedback Impact Statement
**Status**: Implemented on confirmation page (Story 052)
**Pending**: Email implementation (Story 053)
**Last Updated**: 2025-12-06

## Overview

The Feedback Impact Statement is a transparency message that explains to survey respondents how their feedback will be used, who will review it, and the decision-making process. This builds trust and demonstrates that their input is valued.

## Implementation Status

### ✅ Completed
- Added to ThankYouPage (confirmation page at `/thank-you`)
- Mobile-responsive design (16px minimum font size)
- Accessible (semantic heading structure, WCAG 2.1 AA compliant)
- Works in both light and dark modes

### ⏳ Pending
- Email confirmation template (Story 053)

## Content

The impact statement consists of three paragraphs:

### Paragraph 1: Who Reviews Feedback
```
Your responses go directly to the conference organizing team, who review every submission to understand what worked well and what could be better.
```

### Paragraph 2: How Feedback Is Used
```
Within a few weeks after the conference, the team will analyze all feedback and identify common themes and specific suggestions. This analysis directly shapes decisions for future conferences—from session formats and networking opportunities to venue choices and scheduling.
```

### Paragraph 3: Commitment to Transparency
```
We're committed to transparency. You'll be able to see the results and our action plan at the link above. Thank you for helping us create better conference experiences.
```

## Design Specifications

### Visual Presentation
- **Heading**: "How we'll use your feedback" (h3/h4 level)
- **Container**: Subtle background (gray.0 in Mantine color system)
- **Border**: Thin border to distinguish from main content
- **Padding**: Generous padding (lg in Mantine)
- **Spacing**: Appears after results access link, before "Return to Conference Site" button

### Typography
- **Heading**: 24px (h4), centered, medium weight
- **Body Text**: 16px minimum (Mantine size="md"), left-aligned
- **Line Spacing**: Medium gap between paragraphs

### Accessibility
- Semantic HTML heading (`<h3>` or `<h4>`)
- Minimum 16px font size for body text (mobile readability)
- Sufficient color contrast (WCAG 2.1 AA)
- Screen reader friendly structure

## Email Implementation (Story 053)

When implementing Story 053, include the same impact statement in the confirmation email with these considerations:

### Placement
Include the impact statement:
- After the submission confirmation and thank you message
- After the results timeline information
- Before the results access link

### Email-Specific Formatting
- Use plain text or simple HTML formatting
- Maintain the three-paragraph structure
- Use a subtle background color or border to distinguish it
- Ensure font size is at least 16px for readability
- Test in major email clients (Gmail, Outlook, Apple Mail)

### Example Email Structure
```
Subject: Conference Survey Confirmation - Thank You!

Hi there,

Thank you for completing the NAM Conference Survey! Your feedback has been received.

Results will be available after the conference on [DATE].

---

HOW WE'LL USE YOUR FEEDBACK

Your responses go directly to the conference organizing team, who review every submission to understand what worked well and what could be better.

Within a few weeks after the conference, the team will analyze all feedback and identify common themes and specific suggestions. This analysis directly shapes decisions for future conferences—from session formats and networking opportunities to venue choices and scheduling.

We're committed to transparency. You'll be able to see the results and our action plan at the link below. Thank you for helping us create better conference experiences.

---

View results: https://www.equalexperts.com/nam-conference-results

Best regards,
The Conference Team
```

## Content Maintenance

### Updating the Statement
If the content needs to be updated:

1. **Confirmation Page**: Edit `/apps/frontend/src/pages/ThankYouPage.tsx`
2. **Email Template**: Update the email template when Story 053 is implemented
3. Ensure both stay synchronized

### Stakeholder Review
According to Story 055, the impact statement should be:
- Reviewed for tone and authenticity
- Approved by conference organizers (Katie Coleman or planning team)
- Free of corporate jargon
- Genuine and accessible

### When to Update
Consider updating the statement when:
- Past feedback results in concrete changes (add specific examples)
- The review process changes
- The timeline for results publication changes
- New feedback mechanisms are introduced

## Related Stories

- **Story 052**: Confirmation Message After Submission (✅ Built 2025-12-06)
- **Story 053**: Email Confirmation with Timeline (⏳ Draft)
- **Story 055**: Feedback Impact Statement (✅ Built 2025-12-06)
- **Story 056**: Results Dashboard Access (⏳ Draft)

## References

- Product Spec: `/knowledge/product/product-spec.md`
- Katie Coleman Interview: `/product/iterations/2025-11-12-mvp/discovery/interviews/interview-katie-coleman-2025-11-12.md`
- Story Details: `/product/iterations/2025-12-06-feedback-loop/stories/story-055-feedback-impact-statement.md`