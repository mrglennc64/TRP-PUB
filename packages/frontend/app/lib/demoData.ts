// Site-wide demo mode mock data — TrapRoyaltiesPro
// Demo track: Future feat. Drake & Tems — "Wait for U"
// All data sourced from MusicBrainz + ListenBrainz only

export const DEMO_ISRC = 'USSM12200452';

export const DEMO_ROYALTY_RESULT = {
  isrc: 'USSM12200452',
  found: true,
  source: 'musicbrainz',
  song_title: 'Wait for U',
  artist: 'Future feat. Drake & Tems',
  releases: [{ title: 'I NEVER LIKED YOU', date: '2022-04-29', country: 'US', label: 'Epic Records / Freebandz' }],
  gaps: [
    { type: 'ISWC_GAP', severity: 'HIGH', message: 'ISWC not linked in MusicBrainz — publishing royalties cannot be routed automatically.' },
    { type: 'PERCENTAGE_GAP', severity: 'HIGH', message: '2 of 4 writers missing IPI — publishing share partially unclaimed.' },
  ],
  score: 64,
  work: {
    iswc: null,
    writers: [
      { name: 'Nayvadius Wilburn', role: 'composer', ipi: '00736428519' },
      { name: 'Aubrey Graham', role: 'composer', ipi: null },
      { name: 'Temilade Openiyi', role: 'lyricist', ipi: '00987654321' },
      { name: 'Roderick Raheem Harvey', role: 'composer', ipi: null },
    ],
  },
  listen_stats: { total_listens: 582_000_000, unique_listeners: 48_200_000 },
};

export const DEMO_FREE_AUDIT: any = {
  isrc: 'USSM12200452',
  song_title: 'Wait for U',
  artist: 'Future feat. Drake & Tems',
  audit_started: new Date().toISOString(),
  steps: {
    probe: {
      status: 'found',
      checked_at: new Date().toISOString(),
      source: 'MusicBrainz',
      data: {
        mbid: 'f3c87f3b-1234-5678-abcd-ef0123456789',
        title: 'Wait for U',
        artist: 'Future feat. Drake & Tems',
        releases: [{ title: 'I NEVER LIKED YOU', date: '2022-04-29', country: 'US' }],
      },
    },
    streams: {
      total_listens: 582_000_000,
      unique_listeners: 48_200_000,
      data_level: 'exact',
      checked_at: new Date().toISOString(),
      source: 'ListenBrainz',
    },
    verify: {
      status: 'not_found',
      matched: false,
      mlc_song_code: null,
      iswc: null,
      checked_at: new Date().toISOString(),
      source: 'MLC (manual required)',
      data: {},
    },
    detect: {
      black_box: true,
      severity: 'HIGH',
      findings: [
        {
          type: 'ISWC_GAP',
          severity: 'critical',
          title: 'No ISWC Linked',
          description: 'This recording has no ISWC registered in MusicBrainz — publishing royalties cannot be routed automatically to rights holders.',
          action: 'Register an ISWC through your PRO immediately.',
        },
        {
          type: 'PERCENTAGE_GAP',
          severity: 'warning',
          title: 'Partial IPI Coverage',
          description: '2 of 4 writers (Aubrey Graham, Roderick Harvey) are missing IPI numbers — their publishing share may be held in black box accounts.',
          action: 'Each writer must register with their PRO and obtain an IPI number.',
        },
        {
          type: 'NEIGHBORING_RIGHTS_GAP',
          severity: 'warning',
          title: 'Neighboring Rights Unverified',
          description: 'No confirmed neighboring rights registration found for this master recording. Digital performance royalties may be unclaimed.',
          action: 'Register master recording with your neighboring rights collecting society.',
        },
      ],
      streaming: {
        total_listens: 582_000_000,
        unique_listeners: 48_200_000,
        checked_at: new Date().toISOString(),
        source: 'ListenBrainz',
      },
      revenue: { low: 159_000, mid: 187_200, high: 215_000, confidence: 78, confidence_label: 'Moderate-High' },
    },
    manual_checklist: {
      label: 'Manual Verification Required',
      note: 'The following registries require manual lookup — no public API available.',
      items: [
        { registry: 'MLC', purpose: 'Mechanical royalties (streaming)', check: 'Search by ISRC or song title', url: 'https://www.themlc.com', search_term: 'Wait for U Future', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'Song code, writer shares, payout status' },
        { registry: 'ASCAP', purpose: 'Performance royalties', check: 'ACE title search', url: 'https://www.ascap.com/repertory', search_term: 'Wait for U', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'ISWC, writer names, publisher' },
        { registry: 'BMI', purpose: 'Performance royalties', check: 'Repertoire search', url: 'https://repertoire.bmi.com', search_term: 'Wait for U Future', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'BMI work ID, performing artists' },
        { registry: 'Rights Administrator', purpose: 'Digital performance (master)', check: 'Artist/ISRC lookup', url: 'https://www.soundexchange.com', search_term: 'USSM12200452', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'Registration status, payout account' },
      ],
    },
  },
  statute: {
    level: 'warning',
    label: 'Statute of Limitations Advisory',
    color: 'yellow',
    message: '17 U.S.C. § 507(b): Civil copyright claims must be filed within 3 years of discovery. Royalty claims dating to 2022 should be filed by 2025.',
    release_date: '2022-04-29',
    age_years: 3,
  },
  registry_links: [
    { name: 'MLC', org: 'Mechanical Licensing Collective', url: 'https://www.themlc.com', search_term: 'Wait for U Future', note: 'Search by title or ISRC for mechanical royalties' },
    { name: 'ASCAP', org: 'ASCAP', url: 'https://www.ascap.com/repertory', search_term: 'Wait for U', note: 'Performance royalty registry' },
    { name: 'BMI', org: 'BMI', url: 'https://repertoire.bmi.com', search_term: 'Wait for U Future', note: 'Performance royalty registry' },
    { name: 'Rights Administrator', org: 'Rights Administrator', url: 'https://www.soundexchange.com', search_term: 'USSM12200452', note: 'Digital performance royalties (master)' },
  ],
  verdict: {
    level: 'critical',
    color: 'red',
    summary: 'Multiple gaps detected — est. $159,000–$215,000 in unclaimed royalties. Immediate action required to register ISWC and complete writer IPI coverage.',
  },
  _demo: true,
};

// ── Atlanta Heat — High Signal / Low Registration demo ────────────────────────
export const DEMO_AUDIT_ATLANTA: any = {
  isrc: 'USATL2300001',
  song_title: 'Atlanta Heat (Viral Edit)',
  artist: 'TrapArchitect',
  audit_started: new Date().toISOString(),
  steps: {
    probe: {
      status: 'found',
      checked_at: new Date().toISOString(),
      source: 'YouTube / ListenBrainz Secondary Validation Node',
      data: {
        title: 'Atlanta Heat (Viral Edit)',
        artist: 'TrapArchitect',
        releases: [{ title: 'Atlanta Heat (Viral Edit)', date: '2023-06-14', country: 'US' }],
      },
    },
    streams: {
      total_listens: 48_500_000,
      unique_listeners: 3_200_000,
      data_level: 'exact',
      data_note: 'High Market Activity Detected — No Matching Rights Administrator Registration Found.',
      checked_at: new Date().toISOString(),
      source: 'YouTube / ListenBrainz',
    },
    verify: {
      status: 'not_found',
      matched: false,
      mlc_song_code: null,
      iswc: null,
      checked_at: new Date().toISOString(),
      source: 'MLC (manual required)',
      data: {},
    },
    detect: {
      black_box: true,
      severity: 'CRITICAL',
      findings: [
        {
          type: 'LINKAGE_GAP',
          severity: 'critical',
          title: 'Unmapped ISRC — Registry Status: Unclaimed',
          description: 'High Market Activity Detected — No Matching Rights Administrator Registration Found. This ISRC has 48.5M streams across external sources but zero corresponding Neighboring Rights claim. Estimated $14,000+ sitting in the Black Box.',
          action: 'File a Letter of Direction with Rights Administrator immediately to claim Neighboring Rights on this master recording.',
        },
        {
          type: 'NEIGHBORING_RIGHTS_GAP',
          severity: 'critical',
          title: 'No Rights Administrator Registration',
          description: 'Public Data Gap Detected: Master Recording (ISRC) lacks verified association. High potential for Unclaimed Neighboring Rights via Rights Administrator.',
          action: 'Register master recording with Rights Administrator. Provide ISRC, artist legal name, and release date.',
        },
        {
          type: 'ISWC_GAP',
          severity: 'warning',
          title: 'No ISWC Linked',
          description: '100% of publishing royalties are unroutable — no ISWC registered in any PRO.',
          action: 'Register ISWC through your performing rights organization.',
        },
      ],
      streaming: {
        total_listens: 48_500_000,
        unique_listeners: 3_200_000,
        checked_at: new Date().toISOString(),
        source: 'YouTube / ListenBrainz',
      },
      revenue: { low: 12_000, mid: 14_500, high: 17_000, confidence: 72, confidence_label: 'Moderate' },
    },
    manual_checklist: {
      label: 'Manual Verification Required',
      note: 'The following registries require manual lookup — no public API available.',
      items: [
        { registry: 'Rights Administrator', purpose: 'Digital performance (master)', check: 'Artist/ISRC lookup', url: 'https://www.soundexchange.com', search_term: 'USATL2300001', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'Registration status, payout account — EXPECTED: Not Found' },
        { registry: 'MLC', purpose: 'Mechanical royalties (streaming)', check: 'Search by ISRC or song title', url: 'https://www.themlc.com', search_term: 'Atlanta Heat TrapArchitect', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'Song code, writer shares, payout status' },
        { registry: 'ASCAP', purpose: 'Performance royalties', check: 'ACE title search', url: 'https://www.ascap.com/repertory', search_term: 'Atlanta Heat', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'ISWC, writer names, publisher' },
      ],
    },
  },
  statute: {
    level: 'warning',
    label: 'Statute of Limitations Advisory',
    color: 'yellow',
    message: '17 U.S.C. § 507(b): Civil copyright claims must be filed within 3 years of discovery. Act immediately to preserve your claim window.',
    release_date: '2023-06-14',
    age_years: 2,
  },
  registry_links: [
    { name: 'Rights Administrator', org: 'Rights Administrator', url: 'https://www.soundexchange.com', search_term: 'USATL2300001', note: 'Digital performance royalties (master) — PRIORITY: Unclaimed' },
    { name: 'MLC', org: 'Mechanical Licensing Collective', url: 'https://www.themlc.com', search_term: 'Atlanta Heat TrapArchitect', note: 'Mechanical royalties' },
  ],
  verdict: {
    level: 'critical',
    color: 'red',
    summary: 'High Market Activity Detected — No Matching Rights Administrator Registration Found. 48.5M streams with zero Neighboring Rights claim. Est. $12,000–$17,000 in Black Box revenue. File Letter of Direction immediately.',
  },
  _demo: true,
};

// ── Midnight In Stockholm — 107.5% Split Conflict demo ────────────────────────
export const DEMO_AUDIT_STOCKHOLM: any = {
  isrc: 'SEMSM2300002',
  song_title: 'Midnight In Stockholm',
  artist: 'Multiple Contributors',
  audit_started: new Date().toISOString(),
  steps: {
    probe: {
      status: 'found',
      checked_at: new Date().toISOString(),
      source: 'MusicBrainz + ListenBrainz',
      data: { title: 'Midnight In Stockholm', artist: 'Multiple Contributors', releases: [] },
    },
    streams: {
      total_listens: 12_500_000,
      unique_listeners: 1_200_000,
      data_level: 'exact',
      data_note: 'High Market Activity Detected — Registry Conflict blocks Rights Administrator payout.',
      checked_at: new Date().toISOString(),
      source: 'ListenBrainz',
    },
    verify: {
      status: 'conflict',
      matched: false,
      mlc_song_code: null,
      iswc: null,
      checked_at: new Date().toISOString(),
      source: 'MLC (manual required)',
      data: {},
    },
    detect: {
      black_box: true,
      severity: 'CRITICAL',
      findings: [
        {
          type: 'PERCENTAGE_GAP',
          severity: 'critical',
          title: 'Registry Conflict: 107.5% Total Claims Detected',
          description: 'Three producers have filed overlapping ownership claims totaling 107.5%. Rights Administrator cannot distribute until the split is resolved to exactly 100%.',
          action: 'Use the Proportional Rescale tool to normalize claims to 100%, then trigger a Digital Handshake for all parties to re-verify.',
        },
        {
          type: 'ISWC_GAP',
          severity: 'warning',
          title: 'No ISWC Linked',
          description: 'Publishing royalty chain broken across 3 conflicting contributor claims. No ISWC registered.',
          action: 'Resolve split conflict first, then register ISWC.',
        },
      ],
      streaming: {
        total_listens: 12_500_000,
        unique_listeners: 1_200_000,
        checked_at: new Date().toISOString(),
        source: 'ListenBrainz',
      },
      revenue: { low: 8_500, mid: 10_200, high: 12_500, confidence: 68, confidence_label: 'Moderate' },
    },
    manual_checklist: {
      label: 'Manual Verification Required',
      note: 'Resolve split conflict before registry lookup.',
      items: [
        { registry: 'Rights Administrator', purpose: 'Digital performance (master)', check: 'Artist/ISRC lookup', url: 'https://www.soundexchange.com', search_term: 'SEMSM2300002', status: 'manual_required', why_manual: 'No public API', what_to_look_for: 'Payout frozen due to conflicting claims' },
      ],
    },
  },
  statute: {
    level: 'warning',
    label: 'Statute of Limitations Advisory',
    color: 'yellow',
    message: '17 U.S.C. § 507(b): Conflicting claims older than 3 years may be time-barred. Resolve immediately.',
    release_date: '2023-09-01',
    age_years: 1,
  },
  registry_links: [
    { name: 'Rights Administrator', org: 'Rights Administrator', url: 'https://www.soundexchange.com', search_term: 'SEMSM2300002', note: 'Payout frozen — split conflict must be resolved first' },
  ],
  verdict: {
    level: 'critical',
    color: 'red',
    summary: 'Registry Conflict: 107.5% Total Claims. 12.5M streams with payout frozen. Proportional Rescale + Digital Handshake required before any Rights Administrator distribution.',
  },
  _demo: true,
};

export const DEMO_SPLITS = [
  { id: '1', name: 'Nayvadius Wilburn (Future)', role: 'Composer/Performer', percentage: 33.33, ipi: '00736428519', pro: 'ASCAP' },
  { id: '2', name: 'Aubrey Graham (Drake)', role: 'Composer/Performer', percentage: 33.33, ipi: '', pro: 'SOCAN' },
  { id: '3', name: 'Temilade Openiyi (Tems)', role: 'Lyricist/Performer', percentage: 16.67, ipi: '00987654321', pro: 'ASCAP' },
  { id: '4', name: 'Roderick Raheem Harvey', role: 'Composer', percentage: 16.67, ipi: '', pro: '' },
];
