-- Migration 027: Restrict api_logs read access to the service role
--
-- The anon key is public (NEXT_PUBLIC_SUPABASE_ANON_KEY ships in the browser
-- bundle), so a "FOR SELECT USING (true)" policy lets any visitor dump every
-- API log row: IP addresses, user agents, error stacks and request/response
-- bodies. The admin dashboard reads api_logs through the API route, which uses
-- the service role and bypasses RLS — so public read is not needed.

DROP POLICY IF EXISTS "Public read access" ON api_logs;
DROP POLICY IF EXISTS "Service role read access" ON api_logs;

CREATE POLICY "Service role read access" ON api_logs
    FOR SELECT USING (auth.role() = 'service_role');
