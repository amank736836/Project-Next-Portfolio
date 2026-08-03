import { createAdminClient } from '@/lib/supabase/server';
import { FiClock, FiAlertTriangle, FiLink, FiFileText, FiCode, FiUser } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default async function CSPReportsPage() {
  const supabase = await createAdminClient();
  
  const { data: reports, error } = await supabase
    .from('csp_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return <div className="p-8 text-red-400 dashboard-glass-card m-4">Error loading reports: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--admin-title)] flex items-center gap-3 mb-2">
          <span className="text-[var(--admin-accent)]"><FiAlertTriangle /></span>
          CSP Violation Reports
        </h1>
        <p className="text-slate-400">Content Security Policy violations reported by browsers</p>
      </div>
      
      {reports && reports.length > 0 ? (
        <div className="dashboard-glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiClock className="text-slate-500" /> Time</div></th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">Directive</th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiLink className="text-slate-500" /> Blocked URI</div></th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiLink className="text-slate-500" /> Document URI</div></th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiFileText className="text-slate-500" /> Source File</div></th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiCode className="text-slate-500" /> Line</div></th>
                  <th className="p-4 font-semibold text-slate-300 whitespace-nowrap"><div className="flex items-center gap-2"><FiUser className="text-slate-500" /> User Agent</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map(report => (
                  <tr key={report.id} className="transition-colors hover:bg-white/5">
                    <td className="p-4 whitespace-nowrap text-slate-400 text-xs">
                      {new Date(report.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono">
                        {report.violated_directive}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[200px] truncate text-slate-300 font-mono text-xs" title={report.blocked_uri}>
                        {report.blocked_uri}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[150px] truncate text-slate-400 text-xs" title={report.document_uri}>
                        {report.document_uri}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[150px] truncate text-slate-400 text-xs" title={report.source_file}>
                        {report.source_file || '-'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-mono">
                      {report.line_number || '-'}
                    </td>
                    <td className="p-4">
                      <div className="max-w-[250px] truncate text-slate-500 text-xs" title={report.user_agent}>
                        {report.user_agent}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dashboard-glass-card p-8 text-center text-slate-400">
          No CSP violation reports yet.
        </div>
      )}
    </div>
  );
}