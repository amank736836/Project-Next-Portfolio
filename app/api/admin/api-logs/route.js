import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
  const offset = (page - 1) * limit;

  // Filters
  const endpoint = searchParams.get('endpoint');
  const status = searchParams.get('status') ? parseInt(searchParams.get('status')) : null;
  const hasError = searchParams.get('hasError') === 'true';
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const method = searchParams.get('method');

  let query = supabase
    .from('api_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (endpoint) {
    query = query.ilike('endpoint', `%${endpoint}%`);
  }
  if (status) {
    query = query.eq('status_code', status);
  }
  if (hasError) {
    query = query.not('error_message', 'is', null);
  }
  if (from) {
    query = query.gte('created_at', from);
  }
  if (to) {
    query = query.lte('created_at', to);
  }
  if (method) {
    query = query.eq('method', method.toUpperCase());
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }

  return NextResponse.json({
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  }, { headers: NO_CACHE });
}

export async function POST(request) {
  const supabase = await createAdminClient();
  const body = await request.json();

  // Validate required fields
  if (!body.endpoint || !body.method) {
    return NextResponse.json({ error: 'Missing required fields: endpoint, method' }, { status: 400 });
  }

  const logEntry = {
    endpoint: body.endpoint,
    method: body.method.toUpperCase(),
    status_code: body.status_code || null,
    request_body: body.request_body || null,
    request_headers: body.request_headers || null,
    response_body: body.response_body || null,
    error_message: body.error_message || null,
    error_stack: body.error_stack || null,
    duration_ms: body.duration_ms || null,
    user_id: body.user_id || null,
    user_agent: body.user_agent || null,
    ip_address: body.ip_address || null,
  };

  const { data, error } = await supabase.from('api_logs').insert([logEntry]).select();

  if (error) {
    console.error('Failed to log API call:', error);
    // Don't fail the request if logging fails
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
}