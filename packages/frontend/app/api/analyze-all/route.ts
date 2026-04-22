import { NextResponse } from 'next/server';

type Row = Record<string, string | number | null | undefined>;
type Severity = 'high' | 'medium' | 'low';
type Issue = {
  severity: Severity;
  work: string;
  problem: string;
  suggested_fix: string;
  field: string;
  row_index: number;
  current_value?: string | number | null;
  affected_rows?: number[];
};

function get(row: Row, keys: string[]): string {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
  }
  return '';
}

function num(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined || val === '') return null;
  const s = String(val).replace(/[%\s,]/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function isValidIpi(ipi: string): boolean {
  if (!ipi) return false;
  const digits = ipi.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 11;
}

function isValidIswc(iswc: string): boolean {
  if (!iswc) return false;
  return /^T-?\d{3}-?\d{3}-?\d{3}-?\d$/.test(iswc.replace(/\s/g, ''));
}

function isValidIsrc(isrc: string): boolean {
  if (!isrc) return false;
  return /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/.test(isrc.replace(/-/g, '').toUpperCase());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows: Row[] = Array.isArray(body?.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json({
        rows: [],
        issues: [],
        score: 0,
        healthy_tracks: 0,
        total_tracks: 0,
      });
    }

    const issues: Issue[] = [];
    const titleKey = (r: Row) => get(r, ['title', 'Title', 'TITLE', 'work', 'work_title']);

    rows.forEach((row, idx) => {
      const title = titleKey(row) || `Row ${idx + 1}`;
      const iswc = get(row, ['iswc', 'ISWC']);
      const isrc = get(row, ['isrc', 'ISRC']);
      const ipi = get(row, ['ipi', 'IPI', 'ipi_number']);
      const publisher = get(row, ['publisher', 'Publisher', 'publisher_name']);
      const role = get(row, ['role', 'Role']).toLowerCase();
      const writer = get(row, ['writer', 'composer', 'Writer', 'name', 'contributor']);

      if (!iswc) {
        issues.push({
          severity: 'high', field: 'iswc', row_index: idx, work: title,
          problem: 'Missing ISWC',
          suggested_fix: 'Register work with a PRO to obtain an ISWC',
          current_value: '',
        });
      } else if (!isValidIswc(iswc)) {
        issues.push({
          severity: 'medium', field: 'iswc', row_index: idx, work: title,
          problem: `Invalid ISWC format: "${iswc}"`,
          suggested_fix: 'Correct to format T-XXX-XXX-XXX-X',
          current_value: iswc,
        });
      }

      if (isrc && !isValidIsrc(isrc)) {
        issues.push({
          severity: 'medium', field: 'isrc', row_index: idx, work: title,
          problem: `Invalid ISRC format: "${isrc}"`,
          suggested_fix: 'Correct to 12-char CCXXXYYNNNNN format',
          current_value: isrc,
        });
      }

      if (!publisher && role !== 'composer' && role !== 'lyricist' && role !== 'writer') {
        issues.push({
          severity: 'high', field: 'publisher', row_index: idx, work: title,
          problem: 'Missing publisher name',
          suggested_fix: 'Add publisher name for rights administration',
          current_value: '',
        });
      } else if (!publisher && (role === 'composer' || role === 'lyricist' || role === 'writer')) {
        const hasPublisherRow = rows.some((r, i) => i !== idx && titleKey(r) === title && get(r, ['publisher', 'Publisher']));
        if (!hasPublisherRow) {
          issues.push({
            severity: 'high', field: 'publisher', row_index: idx, work: title,
            problem: 'No publisher on this work',
            suggested_fix: 'Register a publisher share',
            current_value: '',
          });
        }
      }

      if (role === 'composer' || role === 'lyricist' || role === 'writer' || writer) {
        if (!ipi) {
          issues.push({
            severity: 'high', field: 'ipi', row_index: idx, work: title,
            problem: `Missing IPI for ${writer || 'writer'}`,
            suggested_fix: 'Look up IPI in MusicBrainz or CISAC',
            current_value: '',
          });
        } else if (!isValidIpi(ipi)) {
          issues.push({
            severity: 'medium', field: 'ipi', row_index: idx, work: title,
            problem: `Invalid IPI: "${ipi}" (expected 9–11 digits)`,
            suggested_fix: 'Correct IPI format',
            current_value: ipi,
          });
        }
      }
    });

    const byTitle = new Map<string, number[]>();
    rows.forEach((r, i) => {
      const t = titleKey(r) || `__row_${i}`;
      if (!byTitle.has(t)) byTitle.set(t, []);
      byTitle.get(t)!.push(i);
    });

    byTitle.forEach((indices, title) => {
      if (indices.length < 2) return;
      const shareFields = ['share_percent', 'share', 'Share', 'share_pct', 'percent'];
      const total = indices.reduce((acc, i) => {
        const s = num(get(rows[i], shareFields) as string);
        return acc + (s ?? 0);
      }, 0);
      const anyHasShare = indices.some((i) => num(get(rows[i], shareFields) as string) !== null);
      if (anyHasShare && Math.abs(total - 100) > 0.5) {
        issues.push({
          severity: 'high', field: 'split_total', row_index: indices[0], work: title,
          problem: `Share total is ${total}% (expected 100%)`,
          suggested_fix: 'Adjust splits to total 100%',
          current_value: total,
          affected_rows: indices,
        });
      }

      const isrcs = new Set(indices.map((i) => get(rows[i], ['isrc', 'ISRC'])).filter(Boolean));
      const iswcs = new Set(indices.map((i) => get(rows[i], ['iswc', 'ISWC'])).filter(Boolean));
      if (isrcs.size > 1 || iswcs.size > 1) {
        issues.push({
          severity: 'medium', field: 'duplicate', row_index: indices[0], work: title,
          problem: `Duplicate title with conflicting identifiers (${isrcs.size} ISRC, ${iswcs.size} ISWC variants)`,
          suggested_fix: 'Merge or rename conflicting versions',
          affected_rows: indices,
        });
      }
    });

    const rowsWithIssues = new Set(issues.flatMap((i) => i.affected_rows ?? [i.row_index]));
    const healthy_tracks = rows.length - rowsWithIssues.size;
    const total_tracks = rows.length;
    const issueWeight = issues.reduce((acc, i) => acc + (i.severity === 'high' ? 8 : i.severity === 'medium' ? 4 : 2), 0);
    const score = Math.max(0, Math.min(100, Math.round(100 - issueWeight)));

    return NextResponse.json({
      rows,
      issues,
      score,
      healthy_tracks,
      total_tracks,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Analysis failed' }, { status: 500 });
  }
}
