import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request) {
  const startTotal = Date.now();
  try {
    const t1 = Date.now();
    const supabase = await createAdminClient();
    const t2 = Date.now();
    console.log(`[CSP Reports] createAdminClient took ${t2 - t1}ms`);

    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const directive = searchParams.get('directive') || '';
    const blockedUri = searchParams.get('blockedUri') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('csp_reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (directive) {
      query = query.ilike('violated_directive', `%${directive}%`);
    }
    if (blockedUri) {
      query = query.ilike('blocked_uri', `%${blockedUri}%`);
    }
    if (dateFrom) {
      query = query.gte('created_at', new Date(dateFrom).toISOString());
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', toDate.toISOString());
    }

    const t3 = Date.now();
    const { data, error, count } = await query;
    const t4 = Date.now();
    console.log(`[CSP Reports] Query took ${t4 - t3}ms, count: ${count}, rows: ${data?.length}`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const t5 = Date.now();
    console.log(`[CSP Reports] Total request time: ${t5 - startTotal}ms`);
    return NextResponse.json({ 
      data: data || [], 
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (err) {
    console.error(`[CSP Reports] Error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}