import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CSPReportsPage() {
  const supabase = await createAdminClient();
  
  const { data: reports, error } = await supabase
    .from('csp_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return <div className="csp-reports-page">Error loading reports: {error.message}</div>;
  }

  return (
    <div className="csp-reports-page">
      <h1>CSP Violation Reports</h1>
      <p className="subtitle">Content Security Policy violations reported by browsers</p>
      
      {reports && reports.length > 0 ? (
        <div className="csp-reports-table-wrapper">
          <table className="csp-reports-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Violated Directive</th>
                <th>Blocked URI</th>
                <th>Document URI</th>
                <th>Source File</th>
                <th>Line</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                  <td className="directive">{report.violated_directive}</td>
                  <td className="blocked-uri">{report.blocked_uri}</td>
                  <td className="doc-uri">{report.document_uri}</td>
                  <td>{report.source_file || '-'}</td>
                  <td>{report.line_number || '-'}</td>
                  <td className="user-agent">{report.user_agent?.substring(0, 80)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-reports">No CSP violation reports yet.</p>
      )}
    </div>
  );
}