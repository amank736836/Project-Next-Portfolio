-- Rollback for Migration 027: Restore public read access on api_logs

DROP POLICY IF EXISTS "Service role read access" ON api_logs;

CREATE POLICY "Public read access" ON api_logs
    FOR SELECT USING (true);
