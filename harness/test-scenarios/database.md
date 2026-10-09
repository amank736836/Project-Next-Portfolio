# Database Scenarios

> All of these require a **real Postgres** instance. They are not run in offline mode.

| ID           | Surface                                  | Scenario                                                                  |
|--------------|------------------------------------------|---------------------------------------------------------------------------|
| SCN-DB-001   | Migrations                               | `npm run db:status` lists every migration in `sql/migrations/` as applied |
| SCN-DB-002   | Migrations                               | `npm run db:migrate` is idempotent                                        |
| SCN-DB-003   | Migrations                               | Hash drift (a migration file edited) is detected                          |
| SCN-DB-004   | Migrations                               | `npm run db:rollback` reverts the last migration (when rollback exists)   |
| SCN-DB-005   | Seeds                                    | `npm run db:seed` populates personal_info, skills, education, etc.         |
| SCN-DB-006   | RLS — personal_info                      | Public SELECT works; service role can INSERT/UPDATE                       |
| SCN-DB-007   | RLS — api_logs                           | Public SELECT works; service role INSERT only                             |
| SCN-DB-008   | RLS — audit_log                          | Only admins (auth role) can SELECT; service role INSERT                   |
| SCN-DB-009   | RLS — social_links                       | Public SELECT works; service role writes                                  |
| SCN-DB-010   | Constraint — skills.percentage           | Reject percentage < 0 or > 100                                            |
| SCN-DB-011   | Constraint — user_settings.type          | Reject unknown `type`                                                     |
| SCN-DB-012   | Trigger — hero_images.enforce_single     | Setting `is_hero = true` un-sets the previous active                       |
| SCN-DB-013   | Trigger — resumes.is_active              | Inserting a new active row un-sets prior active rows                      |
| SCN-DB-014   | Trigger — user_settings.updated_at       | On UPDATE, `updated_at` is set to NOW()                                    |
| SCN-DB-015   | Indexes — api_logs                       | `idx_api_logs_created_at`, `idx_api_logs_endpoint` exist                   |
| SCN-DB-016   | Indexes — audit_log                      | `idx_audit_log_resource` and `idx_audit_log_actor` exist                   |
| SCN-DB-017   | Performance — projects list              | `SELECT * FROM projects WHERE is_hidden = false` uses index (verify EXPLAIN) |
| SCN-DB-018   | Drift — seed vs schema                   | Seed `sql/seeds/*.sql` matches table shape                                 |
