-- Migration 023: Create audit_log table for admin actions

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'visibility_toggle'
    resource_type TEXT NOT NULL, -- 'social_links', 'resumes', 'projects', 'skills', etc.
    resource_id TEXT, -- ID of the affected resource
    old_data JSONB,
    new_data JSONB,
    actor_email TEXT,
    ip_address INET,
    user_agent TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_email);

-- RLS: Only admins can view audit logs
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );