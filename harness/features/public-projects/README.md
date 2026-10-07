# FEAT-006 — Public projects

```text
Feature:        FEAT-006 — Public projects
Purpose:        Show the owner's portfolio projects, filterable by category, with a
                detail modal.
User:           Public visitor.
Entry Point:    GET /projects  (multi-page)  |  In-page section in single-page mode
Dependencies:   /api/projects (returns only verified projects)
Inputs:         None (server component fetches via fetch).
Outputs:        Grid or masonry of project cards.
Business Rules:
  - BR-001 (public visibility filter)
  - BR-014 (is_hidden)
Expected Behavior:
  - Hidden projects and projects missing required details are excluded by the API.
  - Clicking a card opens a modal with full details, image, GitHub/Preview links.
  - Tab filters by category.
Error Handling: API failure → "no projects" empty state; the public filter is the safety net.
Permissions:    None.
Related APIs:   GET /api/projects
Related Database Tables: projects
Related UI:     components/sections/ProjectsSection.jsx, components/PortfolioItem.jsx
Existing Tests: None in the project.
Missing Tests:
  - Filter behaviour (BR-001) end-to-end
  - Modal keyboard accessibility
  - Image fallback to local assets
Known Issues:   None.
```
