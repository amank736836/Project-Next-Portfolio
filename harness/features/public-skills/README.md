# FEAT-003 — Public skills

```text
Feature:        FEAT-003 — Public skills
Purpose:        Render the skill list with category groups, proficiency bars, and icons.
User:           Public visitor.
Entry Point:    GET /skills
Dependencies:   skills table; user_settings (UI flags)
Inputs:         None.
Outputs:        Skill grid grouped by category with percentage bars.
Business Rules: BR-014 (is_hidden), BR-015 (reduced motion).
Expected Behavior:
  - Hidden skills are not displayed.
  - Each skill shows icon, color, name, and proficiency bar.
  - On hover, the bar reveals (in the single-page layout) per motion rules.
Error Handling: Empty skill set → graceful empty state.
Permissions:    None.
Related APIs:   GET /api/admin/skills (admin only; not used by public route)
Related Database Tables: skills, skill_categories
Related UI:     components/Skills.jsx, app/(public)/skills/SkillsPageClient.jsx
Existing Tests: None.
Missing Tests:
  - Category grouping
  - Featured skill cap display
  - Empty-state UI
Known Issues:   None.
```
