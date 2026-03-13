"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FoundingMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    catalogSize: '',
    referral: '',
    headache: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send to your backend API
      const response = await fetch('/api/founding-member/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          catalogSize: '',
          referral: '',
          headache: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>
              </svg>
              <span>Limited Time • Invite Only • Spots Filling Fast</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-cyan">Royalty Accelerator Program</h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-10">
              Be one of the first 50 labels or 500 artists in hip hop & R&B. Lifetime 50% discount + shape the future of royalty recovery, split verification, and on-chain payouts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-purple-400/30">
                <div className="text-5xl font-bold mb-2 neon-purple">50</div>
                <div className="text-lg text-purple-200">Label Spots</div>
                <div className="text-2xl font-bold text-yellow-300 mt-4">28 Remaining</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-purple-400/30">
                <div className="text-5xl font-bold mb-2 neon-purple">500</div>
                <div className="text-lg text-purple-200">Artist Spots</div>
                <div className="text-2xl font-bold text-yellow-300 mt-4">342 Remaining</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-purple-400/30">
                <div className="text-5xl font-bold mb-2 neon-purple">180+</div>
                <div className="text-lg text-purple-200">Applications In</div>
                <div className="text-2xl font-bold text-yellow-300 mt-4">Reviewing Now</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center neon-purple mb-6">Become a Co-Creator</h2>
            <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
              Founding members get more than discounts — you get early audits worth thousands, priority roadmap input, and help build the tool fixing real hip hop/R&B royalty pain (messy features, uncleared samples, lost syncs).
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Labels */}
              <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600 p-10 shadow-2xl shadow-purple-900/40">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-800/50 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <h3 className="text-4xl font-bold neon-purple">For Labels / Crews</h3>
                  </div>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition">Select Path</button>
                </div>
                <ul className="space-y-6 text-lg">
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Full Catalog Audit</strong><p className="text-gray-400">Deep scan of all tracks across PROs, streaming, MLC</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Lifetime 50% Discount</strong><p className="text-gray-400">Half off forever — all features, updates, modules</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Priority Roadmap Input</strong><p className="text-gray-400">Shape features + quarterly strategy sessions</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>White-Glove Onboarding</strong><p className="text-gray-400">Bulk uploads, metadata fixes, team support</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Early Access Perks</strong><p className="text-gray-400">First dibs on AI tools, micro-royalties, new drops</p></div>
                  </li>
                </ul>
              </div>

              {/* Artists */}
              <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl border-2 border-cyan-600 p-10 shadow-2xl shadow-cyan-900/40">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-cyan-800/50 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                    </div>
                    <h3 className="text-4xl font-bold neon-cyan">For Artists / Producers</h3>
                  </div>
                  <button className="px-6 py-3 bg-gray-700 text-gray-300 rounded-full font-bold hover:bg-gray-600 transition">Select Path</button>
                </div>
                <ul className="space-y-6 text-lg">
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Top Tracks Audit</strong><p className="text-gray-400">Deep dive on your hottest 10+ releases</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Lifetime 50% Discount</strong><p className="text-gray-400">Half off artist plans forever</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Direct Team Access</strong><p className="text-gray-400">Private channel for feedback & questions</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Easy Onboarding</strong><p className="text-gray-400">Pull from Spotify/Apple playlists</p></div>
                  </li>
                  <li className="flex space-x-4">
                    <svg className="text-green-400 mt-1 flex-shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                    <div><strong>Split Proof Tools</strong><p className="text-gray-400">Early access to verification wallet</p></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Report Section */}
        <section className="py-20 px-6 bg-black/60">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center neon-cyan mb-12">Your "Found Money Report" Preview</h2>
            <div className="bg-gray-900/80 rounded-3xl border border-purple-900/50 overflow-hidden shadow-2xl">
              <div className="h-3 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-bold neon-purple">Found Money Report</h3>
                    <p className="text-gray-400 mt-2">Example: Rising ATL Trap Label • February 2026</p>
                  </div>
                  <div className="bg-purple-900/50 text-purple-300 px-6 py-3 rounded-full font-bold">CONFIDENTIAL</div>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-red-900/30 rounded-2xl p-6 text-center">
                    <p className="text-red-300 mb-2">Unclaimed Royalties</p>
                    <p className="text-4xl font-bold text-white">$87,200</p>
                    <p className="text-sm text-gray-400 mt-2">est. across 18 tracks</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-2xl p-6 text-center">
                    <p className="text-yellow-300 mb-2">Split Issues</p>
                    <p className="text-4xl font-bold text-white">11 Gaps</p>
                    <p className="text-sm text-gray-400 mt-2">over/under splits detected</p>
                  </div>
                  <div className="bg-cyan-900/30 rounded-2xl p-6 text-center">
                    <p className="text-cyan-300 mb-2">PRO Gaps</p>
                    <p className="text-4xl font-bold text-white">7 Missing</p>
                    <p className="text-sm text-gray-400 mt-2">registrations incomplete</p>
                  </div>
                </div>
                <h4 className="text-2xl font-bold neon-purple mb-6">Top Issues Flagged</h4>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start p-6 bg-gray-800/50 rounded-2xl">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-xl">DRIP TOO HARD</span>
                        <span className="text-gray-400">• Gunna / Lil Baby</span>
                      </div>
                      <p className="text-gray-300 mt-2">BMI registration missing on feature</p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <span className="px-4 py-2 bg-red-600/50 text-red-300 rounded-full text-sm font-bold">HIGH</span>
                      <p className="text-xl font-bold text-white mt-2">Est. $4,800 unclaimed</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 text-center">
                  <button className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 px-10 rounded-full text-xl hover:from-purple-500 hover:to-pink-500 transition">
                    Download Sample Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl border border-purple-900/50 p-12 shadow-2xl">
              <h2 className="text-5xl font-bold text-center neon-cyan mb-4">Apply Now – Spots Limited</h2>
              <p className="text-xl text-center text-gray-300 mb-12">No commitment. Reviewed in 48 hours. 28 label spots left.</p>
              
              {submitStatus === 'success' && (
                <div className="mb-8 p-6 bg-green-600/20 border border-green-500 rounded-2xl text-center">
                  <p className="text-green-400 text-xl font-bold">Application submitted successfully!</p>
                  <p className="text-green-300 mt-2">We'll review within 48 hours and be in touch.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-8 p-6 bg-red-600/20 border border-red-500 rounded-2xl text-center">
                  <p className="text-red-400 text-xl font-bold">Something went wrong</p>
                  <p className="text-red-300 mt-2">Please try again or contact support.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-medium mb-3">Label / Artist Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., 808 Mafia or Metro Boomin" 
                      className="w-full px-6 py-5 bg-gray-800 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-3">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com" 
                      className="w-full px-6 py-5 bg-gray-800 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-medium mb-3">Catalog Size (Tracks or Artists)</label>
                  <input 
                    type="number" 
                    name="catalogSize"
                    value={formData.catalogSize}
                    onChange={handleChange}
                    placeholder="e.g., 150" 
                    className="w-full px-6 py-5 bg-gray-800 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-3">How'd you find us?</label>
                  <select 
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-gray-800 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="instagram">Instagram</option>
                    <option value="beatstars">BeatStars / Airbit</option>
                    <option value="friend">Friend / Collab</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium mb-3">What's your biggest royalty headache?</label>
                  <textarea 
                    name="headache"
                    value={formData.headache}
                    onChange={handleChange}
                    rows={5} 
                    placeholder="e.g., Features not registering, producer splits disputed, unclaimed sync money..." 
                    className="w-full px-6 py-5 bg-gray-800 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-2xl hover:from-pink-500 hover:to-purple-500 shadow-2xl shadow-pink-900/50 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application – Secure Your Spot'}
                </button>
                <p className="text-center text-gray-500 mt-4">We review fast. No payment needed now.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}