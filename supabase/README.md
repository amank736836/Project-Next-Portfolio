# Supabase Database Management

This directory contains the database schema and migration scripts for the portfolio project.

## Directory Structure

- `schema.sql`: The base schema definition (tables, constraints).
- `migrations/`: A history of `ALTER` commands and schema updates.

## How to Apply Changes

1.  **Initial Setup**: Copy the contents of `schema.sql` and run it in the Supabase SQL Editor.
2.  **Migrations**: Run the scripts in the `migrations/` folder in chronological order (by filename prefix).

## Table Definitions

### `projects`
Stores portfolio projects with visibility status and metadata.
- `id`: Unique identifier.
- `title`: Project name.
- `img`: Primary project image URL.
- `image`: Alternate/override project image URL (set by the CMS).
- `description`: Long-form "Strategic Overview" text.
- `is_hidden`: Toggle for visibility on the frontend.
- `details`: JSONB array of project details (links, icons, etc.).

### `education` & `experience`
Stores academic and professional history.
- `id`: Unique identifier.
- `year`: Time range (e.g., "2021 - 2025").
- `title`: Qualification or Job Title.
- `description`: Detailed summary.
- `is_hidden`: Toggle for visibility.

### `personal_info`
Key-value store for static information (Name, Phone, Email, etc.).

### `skills`
List of technical skills and proficiency.
