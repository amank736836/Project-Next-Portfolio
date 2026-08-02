-- Migration 018: Create CSP Reports table
-- Run: npx tsx scripts/run-migration.mjs 018_create_csp_reports.sql

CREATE TABLE IF NOT EXISTS csp_reports (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    document_uri TEXT,
    referrer TEXT,
    violated_directive TEXT,
    effective_directive TEXT,
    original_policy TEXT,
    disposition TEXT,
    blocked_uri TEXT,
    line_number INTEGER,
    column_number INTEGER,
    source_file TEXT,
    script_sample TEXT,
    status_code INTEGER,
    user_agent TEXT,
    ip_address INET
);

-- Index for querying recent reports
CREATE INDEX IF NOT EXISTS idx_csp_reports_created_at ON csp_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_csp_reports_directive ON csp_reports(violated_directive);
CREATE INDEX IF NOT EXISTS idx_csp_reports_blocked_uri ON csp_reports(blocked_uri);

-- RLS: Only authenticated admins can view reports
ALTER TABLE csp_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view CSP reports" ON csp_reports;
CREATE POLICY "Admins can view CSP reports" ON csp_reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

-- Allow anonymous insert for CSP reports (browser sends these)
CREATE POLICY "Allow CSP report submission" ON csp_reports
    FOR INSERT
    WITH CHECK (true);