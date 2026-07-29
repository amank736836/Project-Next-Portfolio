-- Migration: Add api_logs table
-- Version: 1.0.0
-- Description: Creates api_logs table for tracking API call history and failures

-- Table: api_logs
CREATE TABLE IF NOT EXISTS api_logs (
    id BIGSERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    request_body JSONB,
    request_headers JSONB,
    response_body JSONB,
    error_message TEXT,
    error_stack TEXT,
    duration_ms INTEGER,
    user_id UUID,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE api_logs IS 'API call history for debugging and monitoring';
COMMENT ON COLUMN api_logs.endpoint IS 'API endpoint path';
COMMENT ON COLUMN api_logs.method IS 'HTTP method';
COMMENT ON COLUMN api_logs.status_code IS 'HTTP response status code';
COMMENT ON COLUMN api_logs.request_body IS 'Request payload (sanitized)';
COMMENT ON COLUMN api_logs.request_headers IS 'Request headers (sanitized)';
COMMENT ON COLUMN api_logs.response_body IS 'Response payload (sanitized)';
COMMENT ON COLUMN api_logs.error_message IS 'Error message if request failed';
COMMENT ON COLUMN api_logs.error_stack IS 'Error stack trace if applicable';
COMMENT ON COLUMN api_logs.duration_ms IS 'Request duration in milliseconds';
COMMENT ON COLUMN api_logs.user_id IS 'Authenticated user ID if available';
COMMENT ON COLUMN api_logs.user_agent IS 'Client user agent';
COMMENT ON COLUMN api_logs.ip_address IS 'Client IP address';

-- Enable RLS
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON api_logs
    FOR SELECT USING (true);

-- Service role write access (INSERT needs WITH CHECK)
CREATE POLICY "Service role write access" ON api_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_api_logs_error ON api_logs(error_message) WHERE error_message IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_api_logs_duration ON api_logs(duration_ms DESC);

-- Partition by month for performance (optional, for high-volume scenarios)
-- CREATE TABLE IF NOT EXISTS api_logs_2024_01 PARTITION OF api_logs
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Auto-cleanup old logs (keep 90 days)
-- Can be run via pg_cron:
-- SELECT cron.schedule('cleanup-api-logs', '0 3 * * *', $$
--     DELETE FROM api_logs WHERE created_at < NOW() - INTERVAL '90 days';
-- $$);