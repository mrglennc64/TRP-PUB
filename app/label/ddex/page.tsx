'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ---- Types ----

interface DDEXRelease {
  id: string;
  release_title: string;
  artist: string;
  version: string;
  xml_hash: string;
  generated_at: string;
  delivery_status: string;
  handshake_id?: string;
  split_agreement_id?: string;
}

interface DDEXDelivery {
  id: string;
  release_id: string;
  dsp: string;
  status: string;
  sent_at?: string;
  confirmed_at?: string;
  rejection_reason?: string;
}

interface DSRImport {
  id: string;
  dsr_sender: string;
  dsr_period: string;
  imported_at: string;
  total_sales_records: number;
  discrepancies_found: number;
  total_underpayment_usd: number;
  dsr_hash: string;
  verification_hash: string;
}

interface Discrepancy {
  isrc: string;
  track: string;
  artist: string;
  platform: string;
  territory: string;
  plays: number;
  reported: number;
  expected: number;
  difference: number;
  period: string;
}

// ---- Main Page ----

export default function LabelDDEXPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'deliveries' | 'imports' | 'discrepancies'>('generate');
  const [releases, setReleases] = useState<DDEXRelease[]>([]);
  const [deliveries, setDeliveries] = useState<DDEXDelivery[]>([]);
  const [dsrImports, setDsrImports] = useState<DSRImport[]>([]);
  const [allDiscrepancies, setAllDiscrepancies] = useState<Discrepancy[]>([]);

  useEffect(() => {
    fetchReleases();
    fetchDeliveries();
    fetchDsrImports();
  }, []);

  async function fetchReleases() {
    try {
      const res = await fetch('/api/ddex/releases');
      if (res.ok) {
        const data = await res.json();
        setReleases(data.releases || []);
      }
    } catch (_) {}
  }

  async function fetchDeliveries() {
    try {
      const res = await fetch('/api/ddex/deliveries');
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data.deliveries || []);
      }
    } catch (_) {}
  }

  async function fetchDsrImports() {
    try {
      const res = await fetch('/api/ddex/dsr-imports');
      if (res.ok) {
        const data = await res.json();
        setDsrImports(data.imports || []);
        const disc: Discrepancy[] = (data.imports || []).flatMap(
          (imp: any) => imp.discrepancies || []
        );
        setAllDiscrepancies(disc);
      }
    } catch (_) {}
  }

  function onGenerateSuccess(release: DDEXRelease) {
    setReleases((prev) => [release, ...prev]);
  }

  function onImportSuccess(imp: DSRImport, discrepancies: Discrepancy[]) {
    setDsrImports((prev) => [imp, ...prev]);
    setAllDiscrepancies((prev) => [...discrepancies, ...prev]);
  }

  const pendingDeliveries = deliveries.filter((d) => d.status === 'pending').length;
  const totalUnderpayment = dsrImports.reduce((acc, i) => acc + (i.total_underpayment_usd || 0), 0);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold neon-purple">TrapRoyalties Pro</Link>
            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full font-medium">LABEL PORTAL</span>
            <span className="hidden md:block text-gray-500">/</span>
            <span className="hidden md:block px-3 py-1 bg-cyan-900/40 text-cyan-300 text-sm rounded-full font-medium">DDEX Distribution</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/label" className="text-gray-400 hover:text-white text-sm transition">
              Dashboard
            </Link>
            <Link href="/label/ddex" className="text-cyan-400 font-medium text-sm">
              DDEX
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 rounded-3xl p-8 mb-10 border border-cyan-800/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold neon-cyan mb-2">DDEX Distribution Portal</h1>
              <p className="text-lg text-cyan-200/70">Generate ERN 4.3 XML • Send to DSPs • Auto-verify royalties from DSR reports</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://ddex.net"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition"
              >
                DDEX Standards
              </a>
              <button
                onClick={() => setActiveTab('generate')}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-sm hover:from-cyan-500 hover:to-purple-500 transition shadow-lg shadow-cyan-900/40"
              >
                + New Release
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Releases Generated" value={releases.length} color="cyan" />
          <StatCard label="Pending Deliveries" value={pendingDeliveries} color="yellow" />
          <StatCard label="DSR Imports" value={dsrImports.length} color="green" />
          <StatCard
            label="Total Underpayment"
            value={`$${totalUnderpayment.toFixed(2)}`}
            color="red"
            highlight={totalUnderpayment > 0}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="flex space-x-1">
            {(['generate', 'deliveries', 'imports', 'discrepancies'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium rounded-t-lg transition capitalize ${
                  activeTab === tab
                    ? 'bg-gray-900 border border-gray-800 border-b-gray-900 text-cyan-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'generate' && 'Generate DDEX'}
                {tab === 'deliveries' && `Deliveries${pendingDeliveries > 0 ? ` (${pendingDeliveries})` : ''}`}
                {tab === 'imports' && 'Import DSR Reports'}
                {tab === 'discrepancies' && `Discrepancies${allDiscrepancies.length > 0 ? ` (${allDiscrepancies.length})` : ''}`}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
          {activeTab === 'generate' && (
            <DDEXGeneratorTab releases={releases} onSuccess={onGenerateSuccess} />
          )}
          {activeTab === 'deliveries' && (
            <DeliveriesTab deliveries={deliveries} releases={releases} onRefresh={fetchDeliveries} />
          )}
          {activeTab === 'imports' && (
            <DSRImportTab dsrImports={dsrImports} onSuccess={onImportSuccess} />
          )}
          {activeTab === 'discrepancies' && (
            <DiscrepanciesTab discrepancies={allDiscrepancies} />
          )}
        </div>
      </main>
    </div>
  );
}

// ---- Stat Card ----

function StatCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string | number;
  color: string;
  highlight?: boolean;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };
  return (
    <div className={`bg-gray-900/70 rounded-2xl p-5 border ${highlight ? 'border-red-700/60 animate-pulse-slow' : 'border-gray-800'}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color] || 'text-white'}`}>{value}</p>
    </div>
  );
}

// ---- Generate Tab ----

interface GenerateForm {
  title: string;
  artist: string;
  label_name: string;
  label_dpid: string;
  upc: string;
  release_date: string;
  type: string;
  genre: string;
  parental_warning: string;
  version: string;
  isrc: string;
  track_duration: string;
  territory: string;
}

function DDEXGeneratorTab({
  releases,
  onSuccess,
}: {
  releases: DDEXRelease[];
  onSuccess: (r: DDEXRelease) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<GenerateForm>({
    title: '',
    artist: '',
    label_name: '',
    label_dpid: '',
    upc: '',
    release_date: '',
    type: 'Single',
    genre: 'Hip-Hop/Rap',
    parental_warning: 'NotExplicit',
    version: '4.3',
    isrc: '',
    track_duration: 'PT3M00S',
    territory: 'Worldwide',
  });
  const [generated, setGenerated] = useState<{ hash: string; message_id: string; xml?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof GenerateForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        artist: form.artist,
        label_name: form.label_name,
        label_dpid: form.label_dpid || undefined,
        upc: form.upc || undefined,
        release_date: form.release_date,
        type: form.type,
        genre: form.genre || undefined,
        parental_warning: form.parental_warning,
        version: form.version,
        tracks: form.isrc
          ? [{ title: form.title, isrc: form.isrc, duration: form.track_duration }]
          : [],
        territory_deals: {
          [form.territory]: {
            commercial_model: 'SubscriptionModel',
            usage: ['Stream', 'Download'],
            start_date: form.release_date,
          },
        },
      };

      const res = await fetch('/api/ddex/generate?include_xml=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.validation_errors?.join(', ') || 'Generation failed');
        return;
      }

      setGenerated({ hash: data.hash, message_id: data.message_id, xml: data.xml });
      onSuccess({
        id: data.message_id,
        release_title: form.title,
        artist: form.artist,
        version: form.version,
        xml_hash: data.hash,
        generated_at: data.generated_at,
        delivery_status: 'pending',
      });
      setStep(3);
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function downloadXml() {
    if (!generated?.xml) return;
    const blob = new Blob([generated.xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.upc || form.title}_ddex_${form.version}.xml`.replace(/\s+/g, '_');
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl">
      {/* Stepper */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition ${
              step >= s ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-500'
            }`}>{s}</div>
            {i < 2 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-800 relative">
                <div className={`absolute inset-0 bg-cyan-600 transition-all ${step > s ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-between w-full mt-2 text-xs text-gray-500 absolute" style={{ display: 'none' }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-6 -mt-3 px-1">
        <span>Release Info</span>
        <span>Track Details</span>
        <span>Download</span>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-white">Release Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Release Title *" value={form.title} onChange={(v) => set('title', v)} placeholder="e.g. Drip Too Hard" />
            <Field label="Main Artist *" value={form.artist} onChange={(v) => set('artist', v)} placeholder="e.g. Gunna" />
            <Field label="Label Name *" value={form.label_name} onChange={(v) => set('label_name', v)} placeholder="e.g. Young Stoner Life" />
            <Field label="Label DPID" value={form.label_dpid} onChange={(v) => set('label_dpid', v)} placeholder="PADPIDAZZZZXXXXXXU" hint="Your DDEX Party ID" />
            <Field label="UPC / EAN" value={form.upc} onChange={(v) => set('upc', v)} placeholder="123456789012" />
            <Field label="Release Date *" type="date" value={form.release_date} onChange={(v) => set('release_date', v)} />
            <SelectField label="Release Type" value={form.type} onChange={(v) => set('type', v)}
              options={['Single', 'Album', 'EP', 'Compilation']} />
            <Field label="Genre" value={form.genre} onChange={(v) => set('genre', v)} placeholder="Hip-Hop/Rap" />
            <SelectField label="Parental Warning" value={form.parental_warning} onChange={(v) => set('parental_warning', v)}
              options={['NotExplicit', 'Explicit', 'Unknown']} />
            <SelectField label="DDEX Version" value={form.version} onChange={(v) => set('version', v)}
              options={['4.3', '3.8']}
              labels={['ERN 4.3 (Latest)', 'ERN 3.8 (YouTube Compatible)']} />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.title || !form.artist || !form.label_name || !form.release_date}
            className="mt-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition"
          >
            Next: Track Details
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-white">Track Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="ISRC" value={form.isrc} onChange={(v) => set('isrc', v)} placeholder="USABC2400001" hint="International Standard Recording Code" />
            <Field label="Duration (ISO 8601)" value={form.track_duration} onChange={(v) => set('track_duration', v)} placeholder="PT3M00S" hint="e.g. PT3M30S = 3 min 30 sec" />
            <Field label="Territory" value={form.territory} onChange={(v) => set('territory', v)} placeholder="Worldwide" hint="Leave Worldwide for global release" />
          </div>

          {error && (
            <div className="p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition">
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-40 rounded-xl font-bold transition shadow-lg shadow-cyan-900/30"
            >
              {loading ? 'Generating XML...' : 'Generate DDEX ERN XML'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && generated && (
        <div className="space-y-6">
          <div className="p-4 bg-green-900/30 border border-green-700/40 rounded-xl flex items-center gap-3">
            <span className="text-green-400 text-xl">&#10003;</span>
            <div>
              <p className="text-green-300 font-semibold">DDEX ERN {form.version} Generated Successfully</p>
              <p className="text-green-400/70 text-sm mt-0.5">Message ID: {generated.message_id}</p>
            </div>
          </div>

          {/* Hash display */}
          <div>
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">SHA-256 Verification Hash</p>
            <div className="bg-black/40 border border-cyan-900/40 rounded-xl p-4 font-mono text-xs text-cyan-300 break-all">
              {generated.hash}
            </div>
            <p className="text-xs text-gray-500 mt-1">This hash uniquely identifies this DDEX file. Store with your legal documents.</p>
          </div>

          {/* XML preview */}
          {generated.xml && (
            <div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">XML Preview</p>
              <pre className="bg-black/40 border border-gray-800 rounded-xl p-4 text-xs text-gray-300 overflow-auto max-h-64 leading-relaxed">
                {generated.xml.substring(0, 1500)}
                {generated.xml.length > 1500 && '\n... (truncated)'}
              </pre>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={downloadXml}
              className="px-5 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-xl font-bold transition flex items-center gap-2"
            >
              <span>&#8595;</span> Download XML
            </button>
            <button
              onClick={() => { setStep(1); setGenerated(null); setError(''); setForm(f => ({ ...f, isrc: '', upc: '', title: '', artist: '' })); }}
              className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}

      {/* Recent releases */}
      {releases.length > 0 && step === 1 && (
        <div className="mt-10">
          <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-4">Recent Releases</h4>
          <div className="space-y-2">
            {releases.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3 border border-gray-800">
                <div>
                  <p className="text-sm font-medium text-white">{r.release_title}</p>
                  <p className="text-xs text-gray-500">{r.artist} · ERN {r.version}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={r.delivery_status} />
                  <a
                    href={`/api/ddex/releases/${r.id}/xml`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Deliveries Tab ----

function DeliveriesTab({
  deliveries,
  releases,
  onRefresh,
}: {
  deliveries: DDEXDelivery[];
  releases: DDEXRelease[];
  onRefresh: () => void;
}) {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [dsp, setDsp] = useState('Spotify');

  async function markSent(releaseId: string) {
    setMarkingId(releaseId);
    try {
      await fetch(`/api/ddex/deliveries/${releaseId}/mark-sent?dsp=${encodeURIComponent(dsp)}`, { method: 'POST' });
      onRefresh();
    } finally {
      setMarkingId(null);
    }
  }

  const releasesWithoutDelivery = releases.filter(
    (r) => !deliveries.some((d) => d.release_id === r.id)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">DSP Deliveries</h3>
        <button onClick={onRefresh} className="text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition">
          Refresh
        </button>
      </div>

      {deliveries.length === 0 && releasesWithoutDelivery.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No releases yet</p>
          <p className="text-sm">Generate a DDEX release first, then track delivery here.</p>
        </div>
      )}

      {releasesWithoutDelivery.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-3">Ready to Send</h4>
          <div className="flex gap-3 mb-4 items-center">
            <select
              value={dsp}
              onChange={(e) => setDsp(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Tidal', 'Deezer'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">Select DSP, then click Mark Sent</span>
          </div>
          <div className="space-y-2">
            {releasesWithoutDelivery.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3 border border-gray-800">
                <div>
                  <p className="text-sm font-medium text-white">{r.release_title}</p>
                  <p className="text-xs text-gray-500">{r.artist} · {new Date(r.generated_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => markSent(r.id)}
                  disabled={markingId === r.id}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 rounded-lg text-sm font-medium transition"
                >
                  {markingId === r.id ? 'Sending...' : `Mark Sent to ${dsp}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {deliveries.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-3">Delivery History</h4>
          <div className="space-y-2">
            {deliveries.map((d) => {
              const rel = releases.find((r) => r.id === d.release_id);
              return (
                <div key={d.id} className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3 border border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-white">{rel?.release_title || d.release_id}</p>
                    <p className="text-xs text-gray-500">{d.dsp} · {d.sent_at ? new Date(d.sent_at).toLocaleString() : '—'}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- DSR Import Tab ----

function DSRImportTab({
  dsrImports,
  onSuccess,
}: {
  dsrImports: DSRImport[];
  onSuccess: (imp: DSRImport, discrepancies: Discrepancy[]) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [labelId, setLabelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport() {
    if (!file || !labelId) return;
    setLoading(true);
    setError('');
    setResult(null);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`/api/ddex/import-dsr?label_id=${encodeURIComponent(labelId)}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Import failed');
        return;
      }
      setResult(data);
      onSuccess(
        {
          id: Date.now().toString(),
          dsr_sender: data.dsr_sender,
          dsr_period: data.dsr_period,
          imported_at: data.verified_at,
          total_sales_records: data.total_sales_records,
          discrepancies_found: data.discrepancies_found,
          total_underpayment_usd: data.total_underpayment_usd,
          dsr_hash: data.dsr_hash,
          verification_hash: data.verification_hash,
        },
        data.discrepancies || []
      );
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">Import DSR (Digital Sales Report)</h3>
      <p className="text-sm text-gray-400 mb-6">
        Upload a DDEX DSR XML file from a DSP (Spotify, Apple Music, YouTube, etc.) to automatically
        cross-check against your split agreements and detect underpayments.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Label ID</label>
          <input
            type="text"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
            placeholder="Your label identifier"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">DSR XML File</label>
          <div
            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-700 transition"
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-4xl mb-2">&#8593;</p>
                <p className="text-sm">Click to upload DDEX DSR XML</p>
                <p className="text-xs mt-1">Supports ERN/DSR 3.x and 4.x</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".xml" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">{error}</div>
      )}

      <button
        onClick={handleImport}
        disabled={!file || !labelId || loading}
        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition"
      >
        {loading ? 'Importing & Verifying...' : 'Import & Verify Royalties'}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-900/30 border border-green-700/40 rounded-xl">
            <p className="text-green-300 font-semibold mb-3">Import Complete</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Sender: </span><span className="text-white">{result.dsr_sender}</span></div>
              <div><span className="text-gray-400">Period: </span><span className="text-white">{result.dsr_period}</span></div>
              <div><span className="text-gray-400">Records: </span><span className="text-white">{result.total_sales_records}</span></div>
              <div><span className="text-gray-400">Discrepancies: </span><span className={result.discrepancies_found > 0 ? 'text-red-400 font-bold' : 'text-green-400'}>{result.discrepancies_found}</span></div>
            </div>
          </div>

          {result.total_underpayment_usd > 0 && (
            <div className="p-4 bg-red-900/30 border border-red-700/40 rounded-xl">
              <p className="text-red-300 font-semibold">Underpayment Detected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">${result.total_underpayment_usd.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">This amount may be recoverable. Review discrepancies for details.</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-1">Verification Hash (court-admissible)</p>
            <div className="bg-black/40 rounded-lg px-3 py-2 font-mono text-xs text-cyan-300 break-all">{result.verification_hash}</div>
          </div>
        </div>
      )}

      {dsrImports.length > 0 && (
        <div className="mt-10">
          <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-4">Import History</h4>
          <div className="space-y-2">
            {dsrImports.map((imp) => (
              <div key={imp.id} className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3 border border-gray-800">
                <div>
                  <p className="text-sm font-medium text-white">{imp.dsr_sender}</p>
                  <p className="text-xs text-gray-500">{imp.dsr_period} · {imp.total_sales_records} records</p>
                </div>
                <div className="text-right">
                  {imp.discrepancies_found > 0 ? (
                    <p className="text-sm text-red-400 font-bold">{imp.discrepancies_found} discrepancies</p>
                  ) : (
                    <p className="text-sm text-green-400">Clean</p>
                  )}
                  <p className="text-xs text-gray-500">{new Date(imp.imported_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Discrepancies Tab ----

function DiscrepanciesTab({ discrepancies }: { discrepancies: Discrepancy[] }) {
  if (discrepancies.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-5xl mb-4">&#10003;</p>
        <p className="text-lg text-green-400 font-medium">No Discrepancies Found</p>
        <p className="text-sm mt-2">All imported DSR reports match your split agreements.</p>
      </div>
    );
  }

  const totalDiff = discrepancies.reduce((a, d) => a + (d.difference > 0 ? d.difference : 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Royalty Discrepancies</h3>
        <div className="px-4 py-2 bg-red-900/40 border border-red-700/40 rounded-xl">
          <span className="text-sm text-gray-400">Total Underpayment: </span>
          <span className="text-red-400 font-bold">${totalDiff.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="pb-3 pr-4">Track / ISRC</th>
              <th className="pb-3 pr-4">Platform</th>
              <th className="pb-3 pr-4">Territory</th>
              <th className="pb-3 pr-4">Plays</th>
              <th className="pb-3 pr-4">Reported</th>
              <th className="pb-3 pr-4">Expected</th>
              <th className="pb-3">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {discrepancies.map((d, i) => (
              <tr key={i} className="hover:bg-white/5 transition">
                <td className="py-3 pr-4">
                  <p className="text-white font-medium">{d.track}</p>
                  <p className="text-xs text-gray-500">{d.isrc}</p>
                </td>
                <td className="py-3 pr-4 text-gray-300">{d.platform}</td>
                <td className="py-3 pr-4 text-gray-300">{d.territory}</td>
                <td className="py-3 pr-4 text-gray-300">{d.plays.toLocaleString()}</td>
                <td className="py-3 pr-4 text-gray-300">${d.reported.toFixed(4)}</td>
                <td className="py-3 pr-4 text-gray-300">${d.expected.toFixed(4)}</td>
                <td className="py-3">
                  <span className={`font-bold ${d.difference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {d.difference > 0 ? '-' : '+'}${Math.abs(d.difference).toFixed(4)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Shared UI Helpers ----

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 placeholder-gray-600"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: string[];
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
      >
        {options.map((opt, i) => (
          <option key={opt} value={opt}>{labels?.[i] || opt}</option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40',
    sent: 'bg-blue-900/40 text-blue-400 border-blue-700/40',
    confirmed: 'bg-green-900/40 text-green-400 border-green-700/40',
    rejected: 'bg-red-900/40 text-red-400 border-red-700/40',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${map[status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
      {status}
    </span>
  );
}
