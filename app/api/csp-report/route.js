import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/csp-report') && !contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const body = await request.json();
    const report = body['csp-report'] || body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from('csp_reports').insert({
      document_uri: report['document-uri'],
      referrer: report['referrer'],
      violated_directive: report['violated-directive'],
      effective_directive: report['effective-directive'],
      original_policy: report['original-policy'],
      disposition: report['disposition'],
      blocked_uri: report['blocked-uri'],
      line_number: report['line-number'] ? parseInt(report['line-number']) : null,
      column_number: report['column-number'] ? parseInt(report['column-number']) : null,
      source_file: report['source-file'],
      script_sample: report['script-sample'],
      status_code: report['status-code'] ? parseInt(report['status-code']) : null,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  request.headers.get('x-real-ip') ||
                  'unknown'
    });

    if (error) {
      console.error('[CSP Report] Insert error:', error);
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('[CSP Report] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}