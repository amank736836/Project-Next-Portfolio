-- Table: api_logs
-- Description: Stores API call history for debugging and monitoring
-- Version: 1.0.0
-- Dependencies: none

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

-- Service role read access only (for the admin dashboard API route).
-- The anon key is public, so api_logs must never be world-readable: it
-- contains IPs, user agents, error stacks and request/response bodies.
CREATE POLICY "Service role read access" ON api_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Service role write access (for API logging)
CREATE POLICY "Service role write access" ON api_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_api_logs_error ON api_logs(error_message) WHERE error_message IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_api_logs_duration ON api_logs(duration_ms DESC);