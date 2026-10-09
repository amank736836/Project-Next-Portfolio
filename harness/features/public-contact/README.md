# FEAT-007 — Public contact

```text
Feature:        FEAT-007 — Public contact
Purpose:        Let visitors reach the owner via a Formspree-backed form, plus a
                list of social links.
User:           Public visitor.
Entry Point:    GET /contact
Dependencies:   personal_info / social_links (visible links)
                Formspree (form target)
Inputs:         Visitor-supplied name, email, subject, message.
Outputs:        HTML form; submission posts to Formspree.
Business Rules:
  - BR-013 (form-action 'self' https://formspree.io)
Expected Behavior:
  - Form action is `https://formspree.io/...`.
  - Email / phone / social links are shown as clickable items.
  - Subject dropdown lets visitors pick a topic.
Error Handling: Form submission errors are handled by Formspree; the page itself
                does not post to a Next.js API.
Permissions:    None.
Related APIs:   None (Formspree handles delivery)
Related Database Tables: personal_info, social_links
Related UI:     app/(public)/contact/page.jsx
Existing Tests: None.
Missing Tests:
  - Form action attribute is correct
  - CSP allows the form target
Known Issues:   None.
```
