import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const NO_CONTENT = () => new Response(null, { status: 204 });

function normalizeReport(body) {
  const entry = Array.isArray(body) ? body[0] : body;
  return entry?.body || entry?.['csp-report'] || entry;
}

function isReportNoise(report) {
  if (process.env.NODE_ENV !== 'production') return true;

  const sourceFile = report?.['source-file'] || report?.sourceFile || '';
  if (/^(chrome|moz|safari)-extension:/i.test(sourceFile)) return true;

  const documentUri = report?.['document-uri'] || report?.documentURL;
  if (!documentUri) return false;

  try {
    const documentUrl = new URL(documentUri);
    const productionUrl = new URL(
      process.env.NEXT_PUBLIC_APP_URL_PROD ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://amank.co.in'
    );
    return documentUrl.origin !== productionUrl.origin;
  } catch {
    return true;
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (
      !contentType?.includes('application/csp-report') &&
      !contentType?.includes('application/reports+json') &&
      !contentType?.includes('application/json')
    ) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const body = await request.json();
    const report = normalizeReport(body);
    if (!report || typeof report !== 'object') {
      return NextResponse.json({ error: 'Invalid report payload' }, { status: 400 });
    }

    if (isReportNoise(report)) return NO_CONTENT();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from('csp_reports').insert({
      document_uri: report['document-uri'] || report.documentURL,
      referrer: report['referrer'],
      violated_directive: report['violated-directive'] || report.effectiveDirective,
      effective_directive: report['effective-directive'] || report.effectiveDirective,
      original_policy: report['original-policy'] || report.originalPolicy,
      disposition: report['disposition'],
      blocked_uri: report['blocked-uri'] || report.blockedURL,
      line_number: report['line-number'] || report.lineNumber || null,
      column_number: report['column-number'] || report.columnNumber || null,
      source_file: report['source-file'] || report.sourceFile,
      script_sample: report['script-sample'] || report.sample,
      status_code: report['status-code'] || report.statusCode || null,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  request.headers.get('x-real-ip') ||
                  'unknown'
    });

    if (error) {
      console.error('[CSP Report] Insert error:', error);
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
    }

    return NO_CONTENT();
  } catch (err) {
    console.error('[CSP Report] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
