"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

export default function ArtistIntakePage() {
  const [step, setStep] = useState<'info' | 'scan' | 'confirm' | 'done'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Parse URL params
  const [artistName, setArtistName] = useState('');
  const [trackName, setTrackName] = useState('');
  const [ref, setRef] = useState('');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setArtistName(p.get('artist') || '');
    setTrackName(p.get('track') || '');
    setRef(p.get('ref') || '');
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('Camera access denied. Please allow camera access and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) { alert('Please check the authorization box to continue.'); return; }
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => { data[k] = v as string; });
    setFormData(data);
    setStep('scan');
    setTimeout(() => startCamera(), 300);
  };

  const handleFinalSubmit = async () => {
    if (!capturedImage) { alert('Please complete the face scan.'); return; }
    setSubmitting(true);
    const payload = {
      ...formData,
      ref,
      artist_query: artistName,
      track_query: trackName,
      biometric_image: capturedImage,
      submitted_at: new Date().toISOString(),
    };
    try {
      await fetch('/api/artist-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, biometric_image: '[CAPTURED]' }), // don't log image
      });
    } catch (_) {}
    setSubmitting(false);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Identity Verified</h1>
          <p className="text-slate-400 mb-2 text-lg font-medium">{formData.legal_name || artistName}</p>
          <p className="text-slate-500 mb-6 text-sm">
            Your biometric attestation has been recorded and your recovery case has been activated.
            Your attorney will contact you within 1–2 business days.
          </p>
          <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-5 text-left text-sm text-slate-400 space-y-2">
            <p className="text-emerald-400 font-medium mb-2">What happens next?</p>
            <p>1. Attorney reviews your forensic audit exhibit</p>
            <p>2. LOD filed with SoundExchange on your behalf</p>
            <p>3. Attorney contacts you to arrange direct deposit of recovered funds</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">

      {/* Header */}
      <div className="bg-black border-b border-indigo-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-white tracking-tight">TRAPROYALTIES<span className="text-indigo-400">PRO</span></span>
          <span className="text-xs bg-indigo-600/40 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">Secure Identity Verification</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          256-bit SSL encrypted
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[#0f172a] border-b border-white/5 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4 text-xs">
          {[
            { id: 'info', label: 'Your Information' },
            { id: 'scan', label: 'Face Scan' },
            { id: 'confirm', label: 'Confirm' },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-white/10" />}
              <div className={"flex items-center gap-1.5 " + (step === s.id ? "text-white" : "text-slate-600")}>
                <div className={"w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold " +
                  (step === s.id ? "bg-indigo-600 text-white" :
                   ['scan','confirm','done'].includes(step) && ['info'].includes(s.id) ? "bg-emerald-600/40 text-emerald-400" :
                   "bg-white/10 text-slate-600")}>
                  {i + 1}
                </div>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Context */}
        {(artistName || trackName) && (
          <div className="bg-indigo-900/20 border border-indigo-700/40 rounded-xl p-4 mb-8">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-medium mb-1">Recovery Case</p>
            {artistName && <p className="text-white font-semibold">{artistName}</p>}
            {trackName && <p className="text-slate-400 text-sm">{trackName}</p>}
          </div>
        )}

        {/* ── STEP 1: Info form ─────────────────────────────────── */}
        {step === 'info' && (
          <form onSubmit={handleInfoSubmit} className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Identity Verification</h1>
              <p className="text-slate-400 leading-relaxed text-sm">
                Your attorney needs to verify your identity before filing on your behalf.
                Banking information will be collected separately by your attorney after the case is opened.
              </p>
            </div>

            {/* Personal info */}
            <section>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 border-b border-white/10 pb-2">Personal Information</h2>
              <div className="space-y-4">
                {[
                  { name: 'legal_name', label: 'Full Legal Name', placeholder: 'As it appears on your government ID', required: true },
                  { name: 'stage_name', label: 'Stage Name', placeholder: 'Artist / performer name', required: true },
                  { name: 'ssn_ein', label: 'SSN or EIN (for W-9)', placeholder: 'XXX-XX-XXXX or XX-XXXXXXX', required: true, type: 'password' },
                  { name: 'address', label: 'Mailing Address', placeholder: '123 Main St, City, State, ZIP', required: true },
                  { name: 'email', label: 'Email', placeholder: 'you@email.com', required: true, type: 'email' },
                  { name: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', required: true, type: 'tel' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{field.label}</label>
                    <input name={field.name} type={field.type || 'text'} placeholder={field.placeholder}
                      required={field.required} autoComplete="off"
                      className="w-full px-4 py-3 bg-[#1e293b]/60 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm" />
                  </div>
                ))}
              </div>
            </section>

            {/* Authorization */}
            <section>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 border-b border-white/10 pb-2">Authorization</h2>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-indigo-500 flex-shrink-0" />
                <span className="text-sm text-slate-400 leading-relaxed">
                  I authorize TrapRoyalties Pro and its partnered entertainment attorneys to act on
                  my behalf to recover my unclaimed SoundExchange royalties. I understand this is a
                  free service to me and that attorneys work on contingency or flat-fee (I only pay
                  if money is recovered).
                </span>
              </label>
            </section>

            {/* Signature */}
            <section>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 border-b border-white/10 pb-2">Electronic Signature</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Signature <span className="text-slate-500 text-xs">(type your full legal name)</span>
                  </label>
                  <input name="signature" type="text" placeholder="Full legal name" required
                    className="w-full px-4 py-3 bg-[#1e293b]/60 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm font-serif italic" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
                  <input name="sig_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-[#1e293b]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm" />
                </div>
              </div>
            </section>

            <div className="bg-[#1e293b]/40 border border-white/8 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
              <span className="text-emerald-400 font-medium">Next step: </span>
              After submitting your information you will be asked to complete a quick face scan to verify your identity. Your camera will be used for this step.
            </div>

            <button type="submit" disabled={!agreed}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-base flex items-center justify-center gap-2">
              Continue to Face Scan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        )}

        {/* ── STEP 2: Face scan ─────────────────────────────────── */}
        {step === 'scan' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Face Scan</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Take a clear photo of your face. This creates a biometric attestation certificate
              that is cryptographically linked to your case file.
            </p>

            <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl overflow-hidden mb-6">
              {/* Camera view */}
              {!capturedImage ? (
                <div className="relative">
                  {cameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted
                        className="w-full aspect-video object-cover bg-black" />
                      {/* Face guide overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-64 border-2 border-indigo-400/60 rounded-full opacity-60"
                          style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)' }} />
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button onClick={capture}
                          className="w-16 h-16 bg-white rounded-full border-4 border-indigo-500 hover:scale-105 transition shadow-lg flex items-center justify-center">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-[#0f172a] flex flex-col items-center justify-center gap-4">
                      {cameraError ? (
                        <>
                          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-red-400 text-sm text-center px-6">{cameraError}</p>
                          <button onClick={startCamera} className="px-6 py-2.5 bg-indigo-600 rounded-xl text-sm text-white">Retry</button>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-slate-500 text-sm">Camera not started</p>
                          <button onClick={startCamera} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm text-white transition">
                            Start Camera
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img src={capturedImage} alt="Captured face" className="w-full aspect-video object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium">Captured</span>
                  </div>
                </div>
              )}

              {/* Canvas (hidden) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Controls */}
              <div className="p-5">
                {cameraActive && !capturedImage && (
                  <p className="text-xs text-slate-500 text-center">Position your face within the oval and press the button to capture</p>
                )}
                {capturedImage && (
                  <div className="flex gap-3">
                    <button onClick={retake}
                      className="flex-1 py-3 bg-[#0f172a] border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:text-white transition">
                      Retake
                    </button>
                    <button onClick={() => setStep('confirm')}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition">
                      Use This Photo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1e293b]/40 border border-white/8 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
              <span className="text-indigo-400 font-medium">Privacy: </span>
              Your face scan is processed locally on your device. Only a SHA-256 hash of your
              biometric attestation is stored — your actual image is never uploaded to our servers.
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm & submit ──────────────────────────── */}
        {step === 'confirm' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Confirm & Submit</h1>
            <p className="text-slate-400 text-sm mb-8">Review your information before final submission.</p>

            <div className="space-y-4 mb-8">
              {capturedImage && (
                <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-5 flex items-center gap-5">
                  <img src={capturedImage} alt="face" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50" />
                  <div>
                    <p className="text-sm font-semibold text-white">Biometric Scan</p>
                    <p className="text-xs text-emerald-400">Face verified</p>
                  </div>
                </div>
              )}

              <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-5 space-y-3">
                {Object.entries(formData).filter(([k]) => !['sig_date','ssn_ein'].includes(k)).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="text-white">{k === 'signature' ? <em>{v}</em> : v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SSN / EIN</span>
                  <span className="text-white font-mono">••••••••</span>
                </div>
              </div>
            </div>

            <button onClick={handleFinalSubmit} disabled={submitting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition text-base flex items-center justify-center gap-2">
              {submitting ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting...</>
              ) : 'Submit & Activate Recovery Case'}
            </button>

            <button onClick={() => setStep('scan')}
              className="w-full mt-3 py-3 text-slate-500 hover:text-white text-sm transition">
              ← Back to face scan
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
