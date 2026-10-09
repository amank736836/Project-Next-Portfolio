import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * Audit logging for admin actions.
 *
 * The `audit_log` table (migration 023) exists but was never written to by
 * application code. Every admin write handler should call `logAudit` after a
 * successful mutation so the logbook has a trustworthy trail:
 * action ('create' | 'update' | 'delete' | 'visibility_toggle'), the affected
 * resource, a snapshot of the new data, and who did it.
 *
 * The helper never throws — audit failures must not break admin operations.
 *
 * @param {Object} entry
 * @param {'create'|'update'|'delete'|'visibility_toggle'} entry.action
 * @param {string} entry.resourceType - table name, e.g. 'projects'
 * @param {string|number|null} [entry.resourceId]
 * @param {Object|null} [entry.oldData]
 * @param {Object|null} [entry.newData]
 * @param {Request|{headers: Headers}} [entry.request] - used for ip/user-agent
 */
export async function logAudit({ action, resourceType, resourceId = null, oldData = null, newData = null, request = null }) {
  try {
    const supabase = await createAdminClient();
    const user = await getCurrentUser();

    const headers = request?.headers;
    const forwardedFor = headers?.get?.('x-forwarded-for');
    const ipAddress = (forwardedFor && forwardedFor.split(',')[0].trim()) ||
      headers?.get?.('x-real-ip') ||
      null;

    const { error } = await supabase.from('audit_log').insert({
      action,
      resource_type: resourceType,
      resource_id: resourceId !== null && resourceId !== undefined ? String(resourceId) : null,
      old_data: oldData ?? null,
      new_data: newData ?? null,
      actor_email: user?.email || null,
      ip_address: ipAddress,
      user_agent: headers?.get?.('user-agent') || null,
    });

    if (error) {
      console.error('[Audit] Failed to write audit_log row:', error.message);
    }
  } catch (error) {
    console.error('[Audit] Failed to write audit_log row:', error);
  }
}
