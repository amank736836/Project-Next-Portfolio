$headers = @{
  "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0anNzdWtmeGt4dGxiZWh4ZHFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY5NjIyMywiZXhwIjoyMDkzMjcyMjIzfQ.jriSk42uWQmRtRnPnolRUvFRa1GiX9-erkX-wWvknMM"
  "Content-Type" = "application/json"
}

# Create exec_sql function
$sql1 = @"
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
"@

$body1 = @{ query = $sql1 } | ConvertTo-Json -Depth 10

try {
  $result = Invoke-RestMethod -Method Post -Uri "https://ptjssukfxkxtlbehxdqk.supabase.co/rest/v1/rpc/query" -Headers $headers -Body $body1
  Write-Host "Function created: $result"
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
  }
}