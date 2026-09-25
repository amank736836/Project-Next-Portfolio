'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiClock, FiAlertTriangle, FiLink, FiFileText, FiCode, FiUser, FiCopy, FiCheck, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { useToast, useSuccessToast } from '@/components/Admin/Toast';

export default function CSPReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    directive: '',
    blockedUri: '',
    dateFrom: '',
    dateTo: ''
  });
  const [copiedId, setCopiedId] = useState(null);

  const successToast = useSuccessToast();
  const addToast = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });
      
      if (filters.directive) params.append('directive', filters.directive);
      if (filters.blockedUri) params.append('blockedUri', filters.blockedUri);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const res = await fetch(`/api/admin/csp-reports?${params}`);
      const data = await res.json();
      
      if (res.ok) {
        setReports(data.data || []);
        setTotalCount(data.total || 0);
      } else {
        setError(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const copyToClipboard = async (report) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopiedId(report.id);
      successToast('Report copied as JSON');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      addToast('Failed to copy');
    }
  };

  const copyPageAsJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(reports, null, 2));
      successToast(`Copied ${reports.length} reports as JSON`);
    } catch (err) {
      addToast('Failed to copy page');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (error) {
    return (
      <div className="p-8 text-red-400 dashboard-glass-card m-4">
        Error loading reports: {error}
      </div>
    );
  }

  return (
    <div className="csp-report-page p-4 sm:p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--admin-title)] flex items-center gap-3 mb-2">
          <span className="text-[var(--admin-accent)]"><FiAlertTriangle /></span>
          CSP Violation Reports
        </h1>
        <p className="text-slate-400">Content Security Policy violations reported by browsers</p>
      </div>

      {/* Filters */}
      <div className="dashboard-glass-card p-4 mb-6">
        <div className="csp-report-filters grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="csp-report-filter-with-icon">
            <FiFilter className="csp-report-filter-icon text-slate-500" size={16} aria-hidden="true" />
            <input
              type="text"
              aria-label="Filter by directive"
              placeholder="Filter by directive..."
              value={filters.directive}
              onChange={e => setFilters(prev => ({ ...prev, directive: e.target.value }))}
              className="csp-report-filter-input w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--admin-accent)]"
            />
          </div>
          <div className="csp-report-filter-with-icon">
            <FiLink className="csp-report-filter-icon text-slate-500" size={16} aria-hidden="true" />
            <input
              type="text"
              aria-label="Filter by blocked URI"
              placeholder="Filter by blocked URI..."
              value={filters.blockedUri}
              onChange={e => setFilters(prev => ({ ...prev, blockedUri: e.target.value }))}
              className="csp-report-filter-input w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--admin-accent)]"
            />
          </div>
          <input
            type="date"
            aria-label="Filter from date"
            placeholder="From date"
            value={filters.dateFrom}
            onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="csp-report-date-input bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[var(--admin-accent)]"
          />
          <input
            type="date"
            aria-label="Filter to date"
            placeholder="To date"
            value={filters.dateTo}
            onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="csp-report-date-input bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[var(--admin-accent)]"
          />
        </div>
      </div>

      {reports.length > 0 ? (
        <>
          <div className="dashboard-glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiClock className="text-slate-500" /> Time</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">Directive</th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiLink className="text-slate-500" /> Blocked URI</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiLink className="text-slate-500" /> Document URI</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiFileText className="text-slate-500" /> Source File</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiCode className="text-slate-500" /> Line</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2"><FiUser className="text-slate-500" /> User Agent</div>
                    </th>
                    <th className="p-4 font-semibold text-slate-300 whitespace-nowrap">
                      <FiCopy className="text-slate-500" title="Copy JSON" />
                    </th>
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
                      <td className="p-4 text-center">
                        <button
                          onClick={() => copyToClipboard(report)}
                          className={`p-2 rounded transition-colors ${copiedId === report.id ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-green-400 hover:bg-white/5'}`}
                          title={copiedId === report.id ? 'Copied!' : 'Copy as JSON'}
                        >
                          {copiedId === report.id ? <FiCheck size={16} /> : <FiCopy size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="dashboard-glass-card p-4 mt-4 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-slate-400">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} reports
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyPageAsJson}
                  disabled={reports.length === 0 || loading}
                  className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <FiCopy size={12} /> Copy Page as JSON
                </button>
                <select
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm text-white focus:outline-none focus:border-[var(--admin-accent)]"
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="p-2 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="px-3 text-sm text-slate-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="p-2 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="dashboard-glass-card p-8 text-center text-slate-400">
          No CSP violation reports yet.
        </div>
      )}
    </div>
  );
}
