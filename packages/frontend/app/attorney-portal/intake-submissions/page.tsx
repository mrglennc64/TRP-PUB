"use client";
import { useEffect, useState, useCallback } from 'react';

type Submission = {
  legal_name?: string;
  stage_name?: string;
  ssn_ein?: string;
  address?: string;
  email?: string;
  phone?: string;
  signature?: string;
  sig_date?: string;
  artist_query?: string;
  track_query?: string;
  ref?: string;
  case_ref?: string;
  received_at?: string;
};

function downloadCSV(submissions: Submission[]) {
  const headers = ['#', 'Stage Name', 'Legal Name', 'Artist', 'Track', 'Email', 'Phone', 'Address', 'Signature', 'Date Signed', 'Received', 'Case Ref'];
  const rows = submissions.map((s, i) => [
    submissions.length - i,
    s.stage_name || '',
    s.legal_name || '',
    s.artist_query || '',
    s.track_query || '',
    s.email || '',
    s.phone || '',
    s.address || '',
    s.signature || '',
    s.sig_date || '',
    s.received_at ? new Date(s.received_at).toLocaleString() : '',
    s.case_ref || '',
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => JSON.stringify(String(v))).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'intake-submissions-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function IntakeSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(() => {
    setLoading(true);
    fetch('/api/intake-submissions', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setSubmissions(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Attorney Portal</p>
            <h1 className="text-3xl font-bold text-white">Artist Intake Submissions</h1>
            <p className="text-slate-400 mt-1 text-sm">{submissions.length} submission{submissions.length !== 1 ? 's' : ''} received</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm rounded-xl transition disabled:opacity-50"
            >
              <svg className={"w-4 h-4 " + (loading ? "animate-spin" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            {submissions.length > 0 && (
              <button
                onClick={() => downloadCSV(submissions)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-slate-500">Loading submissions...</div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-slate-500 text-lg font-medium">No submissions yet</p>
            <p className="text-slate-600 text-sm mt-2">Artist intake forms will appear here once submitted.</p>
          </div>
        )}

        {!loading && submissions.length > 0 && (
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="py-4 px-5 text-left">#</th>
                  <th className="py-4 px-5 text-left">Artist</th>
                  <th className="py-4 px-5 text-left">Track / Case</th>
                  <th className="py-4 px-5 text-left">Legal Name</th>
                  <th className="py-4 px-5 text-left">Email</th>
                  <th className="py-4 px-5 text-left">Received</th>
                  <th className="py-4 px-5 text-left">Status</th>
                  <th className="py-4 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 text-slate-600 text-xs">{submissions.length - i}</td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{s.stage_name || s.artist_query || '—'}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.artist_query}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-400 text-xs">{s.track_query || '—'}</td>
                    <td className="py-4 px-5 text-slate-300">{s.legal_name || '—'}</td>
                    <td className="py-4 px-5 text-slate-400 text-xs">{s.email || '—'}</td>
                    <td className="py-4 px-5 text-slate-500 text-xs whitespace-nowrap">
                      {s.received_at ? new Date(s.received_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Submitted
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(s)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-medium transition">
                          View
                        </button>
                        {s.case_ref && (
                          <a href={'/lawyer/' + s.case_ref + '?artist=' + encodeURIComponent(s.artist_query || '') + '&track=' + encodeURIComponent(s.track_query || '')}
                            target="_blank" rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg font-medium transition whitespace-nowrap">
                            Case Report ↗
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}>
            <div className="bg-[#0f172a] border border-white/15 rounded-2xl p-7 max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.stage_name || selected.artist_query}</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{selected.track_query}</p>
                  {selected.case_ref && (
                    <p className="text-[10px] font-mono text-indigo-400 mt-1">{selected.case_ref}</p>
                  )}
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-slate-500 hover:text-white text-2xl leading-none transition">&times;</button>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Legal Name', value: selected.legal_name },
                  { label: 'Stage Name', value: selected.stage_name },
                  { label: 'Mailing Address', value: selected.address },
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone },
                  { label: 'SSN / EIN', value: selected.ssn_ein ? '••••••••' : undefined },
                  { label: 'Signature', value: selected.signature, italic: true },
                  { label: 'Date Signed', value: selected.sig_date },
                  { label: 'Submitted', value: selected.received_at ? new Date(selected.received_at).toLocaleString() : undefined },
                ].filter(r => r.value).map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                    <span className="text-slate-500">{row.label}</span>
                    <span className={"text-white font-mono text-xs" + (row.italic ? " font-serif not-italic italic" : "")}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {selected.ssn_ein && (
                <details className="mt-4">
                  <summary className="text-xs text-slate-600 cursor-pointer hover:text-slate-400 transition select-none">
                    Click to reveal SSN / EIN
                  </summary>
                  <p className="mt-2 font-mono text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
                    {selected.ssn_ein}
                  </p>
                </details>
              )}

              <div className="mt-6 flex gap-3 flex-wrap">
                {selected.case_ref && (
                  <a href={'/lawyer/' + selected.case_ref + '?artist=' + encodeURIComponent(selected.artist_query || '') + '&track=' + encodeURIComponent(selected.track_query || '')}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl text-center transition">
                    Open Case Report ↗
                  </a>
                )}
                <a href={"mailto:" + selected.email + "?subject=Your Royalty Recovery Case is Active&body=Hi " + (selected.stage_name || selected.legal_name) + ",%0D%0A%0D%0AYour intake form has been received. We will be in touch within 1-2 business days."}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl text-center transition">
                  Email Artist
                </a>
                <button onClick={() => setSelected(null)}
                  className="px-5 py-3 bg-[#1e293b] border border-white/10 text-slate-400 hover:text-white text-sm rounded-xl transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
