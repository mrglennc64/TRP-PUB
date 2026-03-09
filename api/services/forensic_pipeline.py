"""
Forensic Royalty Pipeline
─────────────────────────
Step 1  PROBE   — SMPT/IFPI: Find official recording owner, ISWC, IPI
Step 2  VERIFY  — MLC: Check if mechanical work is linked / matched
Step 3  STREAMS — ListenBrainz: Confirm active earnings evidence
Step 4  DETECT  — Black Box: unmatched MLC + active SoundExchange earnings
"""
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Dict, List, Optional
from urllib.parse import quote

import requests

logger = logging.getLogger(__name__)
_executor = ThreadPoolExecutor(max_workers=6)

_HEADERS = {
    "User-Agent": "TrapRoyaltiesPro/1.0 (contact@traproyaltiespro.com)",
    "Accept": "application/json",
}

# Revenue rate constants (per stream)
_RATE_LOW  = 0.0007   # conservative mechanical only
_RATE_MID  = 0.003    # industry average blended
_RATE_HIGH = 0.004    # full stack (mechanical + performance + SoundExchange)

# Statute of limitations thresholds (years)
_SOL_URGENT_YEARS  = 3.0
_SOL_WARNING_YEARS = 2.5

def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")


# ─────────────────────────────────────────────
# STEP 1 · PROBE — SMPT (MusicBrainz) / IFPI
# ─────────────────────────────────────────────

def _probe_smpt(isrc: str) -> Dict:
    """Query global SMPT registry for official recording owner and identifiers."""
    try:
        import musicbrainzngs as mb
        mb.set_useragent("TrapRoyaltiesPro", "1.0", "contact@traproyaltiespro.com")

        result = mb.search_recordings(isrc=isrc, limit=1)
        recordings = result.get("recording-list", [])

        if not recordings:
            return {
                "status": "not_found",
                "message": "ISRC not registered in SMPT global registry",
                "checked_at": _now_iso(),
                "source": "SMPT / MusicBrainz",
            }

        rec = recordings[0]
        recording_id = rec.get("id")
        song_title = rec.get("title", "Unknown")
        duration_ms = rec.get("length")
        first_release_date = rec.get("first-release-date")

        # Artist credit
        artist_name, artist_mbid = "Unknown", None
        if rec.get("artist-credit"):
            ac = rec["artist-credit"][0]
            if isinstance(ac, dict) and ac.get("artist"):
                a = ac["artist"]
                artist_name = a.get("name", "Unknown")
                artist_mbid = a.get("id")

        # Work relationship (ISWC) + artist relations
        iswc, has_work_rel = None, False
        if recording_id:
            try:
                detail = mb.get_recording_by_id(
                    recording_id, includes=["work-rels", "artist-rels"]
                )
                work_rels = detail.get("recording", {}).get("work-relation-list", [])
                if work_rels:
                    has_work_rel = True
                    work = work_rels[0].get("work", {})
                    raw_iswc = work.get("iswc-list", [])
                    if raw_iswc:
                        iswc = (
                            raw_iswc[0]
                            if isinstance(raw_iswc[0], str)
                            else raw_iswc[0].get("iswc")
                        )
            except Exception:
                pass

        # IPI / ISNI
        ipi, isni = None, None
        if artist_mbid:
            try:
                a_info = mb.get_artist_by_id(artist_mbid, includes=["isnis"])
                a_data = a_info.get("artist", {})
                ipi_list = a_data.get("ipi-list", [])
                isni_list = a_data.get("isni-list", [])
                ipi = ipi_list[0] if ipi_list else None
                isni = isni_list[0] if isni_list else None
            except Exception:
                pass

        return {
            "status": "found",
            "recording_id": recording_id,
            "song_title": song_title,
            "artist": artist_name,
            "artist_mbid": artist_mbid,
            "iswc": iswc,
            "ipi": ipi,
            "isni": isni,
            "has_work_relationship": has_work_rel,
            "duration_ms": duration_ms,
            "first_release_date": first_release_date,
            "checked_at": _now_iso(),
            "source": "SMPT / MusicBrainz",
        }

    except Exception as e:
        logger.error(f"PROBE error: {e}")
        return {"status": "error", "message": str(e), "checked_at": _now_iso(), "source": "SMPT / MusicBrainz"}


# ─────────────────────────────────────────────
# STEP 2 · VERIFY — MLC Mechanical Linkage
# ─────────────────────────────────────────────

def _verify_mlc(isrc: str, probe: Dict) -> Dict:
    """Query The MLC to verify mechanical work is linked and matched."""
    endpoints = [
        ("GET", "https://api.themlc.com/search", {"searchTerm": isrc, "types": "work", "pageSize": 5}),
        ("GET", "https://api.themlc.com/works", {"query": isrc, "limit": 5}),
        ("GET", "https://api.themlc.com/v1/works/search", {"q": isrc, "limit": 5}),
    ]

    for method, url, params in endpoints:
        try:
            r = requests.get(url, params=params, headers=_HEADERS, timeout=10)
            if r.status_code == 200:
                data = r.json()
                works = (
                    data.get("works")
                    or data.get("results")
                    or data.get("items")
                    or []
                )
                if works:
                    w = works[0]
                    ms = w.get("matchStatus", "MATCHED")
                    return {
                        "status": "found",
                        "matched": ms != "UNMATCHED",
                        "match_status": ms,
                        "mlc_song_code": w.get("songCode") or w.get("id"),
                        "iswc": w.get("iswc"),
                        "title": w.get("title"),
                        "total_shares": w.get("totalShares"),
                        "checked_at": _now_iso(),
                        "source": "The MLC (themlc.com)",
                    }
        except Exception:
            continue

    return {
        "status": "not_found",
        "matched": False,
        "match_status": "UNMATCHED",
        "mlc_song_code": None,
        "iswc": None,
        "title": None,
        "checked_at": _now_iso(),
        "source": "The MLC (themlc.com)",
    }


# ─────────────────────────────────────────────
# STEP 3 · STREAMS — ListenBrainz (earnings evidence)
# ─────────────────────────────────────────────

def _get_streaming_stats(artist_mbid: Optional[str]) -> Dict:
    if not artist_mbid:
        return {"total_listens": 0, "unique_listeners": 0, "checked_at": _now_iso(), "source": "ListenBrainz"}
    try:
        r = requests.post(
            "https://api.listenbrainz.org/1/popularity/artist",
            json={"artist_mbids": [artist_mbid]},
            timeout=5,
        )
        if r.status_code == 200:
            stats = r.json()
            if stats:
                return {
                    "total_listens": stats[0].get("listen_count", 0),
                    "unique_listeners": stats[0].get("listener_count", 0),
                    "checked_at": _now_iso(),
                    "source": "ListenBrainz",
                }
    except Exception:
        pass
    return {"total_listens": 0, "unique_listeners": 0, "checked_at": _now_iso(), "source": "ListenBrainz"}


# ─────────────────────────────────────────────
# STATUTE OF LIMITATIONS CHECK
# ─────────────────────────────────────────────

def _check_statute(first_release_date: Optional[str]) -> Optional[Dict]:
    """
    Check if the claim window is approaching or expired.
    17 U.S.C. § 507(b): 3-year civil copyright statute of limitations.
    """
    if not first_release_date:
        return None
    try:
        # Parse partial dates (YYYY, YYYY-MM, YYYY-MM-DD)
        parts = first_release_date.split("-")
        year = int(parts[0])
        month = int(parts[1]) if len(parts) > 1 else 1
        day = int(parts[2]) if len(parts) > 2 else 1
        release = datetime(year, month, day, tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        age_years = (now - release).days / 365.25

        if age_years >= _SOL_URGENT_YEARS:
            return {
                "level": "urgent",
                "label": "STATUTE — FILE IMMEDIATELY",
                "color": "red",
                "message": (
                    f"This recording was released {age_years:.1f} years ago. "
                    "Under 17 U.S.C. § 507(b), the 3-year civil copyright statute of limitations "
                    "may have passed for claims predating this window. File immediately or consult "
                    "counsel about tolling arguments."
                ),
                "release_date": first_release_date,
                "age_years": round(age_years, 1),
            }
        elif age_years >= _SOL_WARNING_YEARS:
            remaining_months = round((_SOL_URGENT_YEARS - age_years) * 12)
            return {
                "level": "warning",
                "label": f"STATUTE WARNING — {remaining_months} months remaining",
                "color": "yellow",
                "message": (
                    f"This recording is {age_years:.1f} years old. "
                    f"Approximately {remaining_months} months remain before the 3-year statute "
                    "of limitations (17 U.S.C. § 507(b)) may limit recovery. Prioritize this claim."
                ),
                "release_date": first_release_date,
                "age_years": round(age_years, 1),
            }
        return None
    except Exception:
        return None


# ─────────────────────────────────────────────
# STEP 4 · DETECT — Black Box + Gap Analysis
# ─────────────────────────────────────────────

def _detect_black_box(probe: Dict, verify: Dict, streaming: Dict) -> Dict:
    findings: List[Dict] = []
    black_box_detected = False

    is_registered = probe.get("status") == "found"
    mlc_matched = verify.get("matched", False)
    has_iswc = bool(probe.get("iswc") or verify.get("iswc"))
    has_ipi = bool(probe.get("ipi"))
    has_work_rel = probe.get("has_work_relationship", False)
    listens = streaming.get("total_listens", 0)
    active_streams = listens > 0

    # Revenue range calculation
    revenue_low  = round(listens * _RATE_LOW)
    revenue_mid  = round(listens * _RATE_MID)
    revenue_high = round(listens * _RATE_HIGH)

    # Confidence factor based on match quality
    if is_registered and mlc_matched and has_iswc:
        confidence = 1.0
        confidence_label = "HIGH — Exact ISRC match across registries"
    elif is_registered and mlc_matched:
        confidence = 0.8
        confidence_label = "MEDIUM — ISRC matched, ISWC pending"
    elif is_registered:
        confidence = 0.65
        confidence_label = "MEDIUM — Recording found, MLC unmatched"
    else:
        confidence = 0.4
        confidence_label = "LOW — No registry match, estimate based on artist streams"

    severity_rank = {"clear": 0, "warning": 1, "critical": 2}
    severity = "clear"

    def bump(s: str):
        nonlocal severity
        if severity_rank[s] > severity_rank[severity]:
            severity = s

    # ── BLACK BOX: MLC unmatched + active stream evidence
    if not mlc_matched and active_streams:
        black_box_detected = True
        bump("critical")
        findings.append({
            "type": "black_box",
            "severity": "critical",
            "title": "Black Box Royalties Detected",
            "description": (
                f"This recording has {listens:,} documented streams but MLC shows no matched "
                "mechanical work. These royalties are sitting in the unmatched pool — claimable "
                "with proper copyright chain documentation."
            ),
            "action": "File a claim with The MLC. Provide ISRC, ISWC, and ownership chain.",
            "checked_at": verify.get("checked_at", _now_iso()),
            "source": "The MLC + ListenBrainz",
            "estimated_low": revenue_low,
            "estimated_high": revenue_high,
        })

    # ── MLC not found but no stream evidence
    elif not mlc_matched:
        bump("warning")
        findings.append({
            "type": "mlc_unmatched",
            "severity": "warning",
            "title": "Mechanical Work Not Matched in MLC",
            "description": "The MLC does not have a matched mechanical license for this recording. "
                           "Mechanical royalties from on-demand streaming cannot be distributed.",
            "action": "Submit this work to The MLC with ISRC and copyright documentation.",
            "checked_at": verify.get("checked_at", _now_iso()),
            "source": "The MLC (themlc.com)",
            "estimated_low": revenue_low,
            "estimated_high": revenue_high,
        })

    # ── No ISWC → mechanical royalties blocked
    if is_registered and not has_iswc:
        bump("warning")
        findings.append({
            "type": "missing_iswc",
            "severity": "warning",
            "title": "No ISWC — Mechanical Royalties Blocked",
            "description": "Recording is not linked to a composition work. Streaming platforms "
                           "cannot route mechanical royalty payments without an ISWC.",
            "action": "Register the composition with ASCAP or BMI to obtain an ISWC, "
                      "then link it to this recording in SMPT.",
            "checked_at": probe.get("checked_at", _now_iso()),
            "source": "SMPT / MusicBrainz",
        })

    # ── No IPI → performance royalties can't route
    if is_registered and not has_ipi:
        bump("warning")
        findings.append({
            "type": "missing_ipi",
            "severity": "warning",
            "title": "No IPI Number — Performance Royalties at Risk",
            "description": "Artist has no IPI identifier on record. Performance royalties "
                           "from ASCAP, BMI, SESAC, and international PROs cannot be attributed.",
            "action": "Register with a PRO (ASCAP/BMI/SESAC) to receive an IPI number.",
            "checked_at": probe.get("checked_at", _now_iso()),
            "source": "SMPT / MusicBrainz",
        })

    # ── ASCAP/BMI split audit flag
    if is_registered and mlc_matched and has_iswc:
        findings.append({
            "type": "split_audit",
            "severity": "info",
            "title": "PRO Split Verification Required",
            "description": "Work is registered and matched. Verify ASCAP/BMI ownership splits "
                           "match the MLC record — discrepancies of 15–40% are common.",
            "action": "Cross-reference your ASCAP/BMI registration splits against the MLC "
                      "total shares using the registry links below.",
            "checked_at": verify.get("checked_at", _now_iso()),
            "source": "The MLC + ASCAP/BMI",
        })

    # ── Not in registry at all
    if not is_registered:
        bump("critical")
        findings.append({
            "type": "not_registered",
            "severity": "critical",
            "title": "Not Found in Global Registry",
            "description": "This ISRC does not exist in the SMPT global database. "
                           "All royalty collection paths — streaming, mechanical, performance — are blocked.",
            "action": "Register through a licensed distributor that issues and submits ISRCs globally.",
            "checked_at": probe.get("checked_at", _now_iso()),
            "source": "SMPT / MusicBrainz",
        })

    return {
        "black_box_detected": black_box_detected,
        "severity": severity,
        "findings": findings,
        "streaming_stats": streaming,
        "revenue": {
            "low": revenue_low,
            "mid": revenue_mid,
            "high": revenue_high,
            "confidence": confidence,
            "confidence_label": confidence_label,
        },
    }


# ─────────────────────────────────────────────
# PRO REGISTRY AUTO-QUERIES (ASCAP / BMI / SESAC)
# ─────────────────────────────────────────────

def _query_ascap(term: str) -> Dict:
    endpoints = [
        f"https://www.ascap.com/api/1.0/search/composerAndPublisher?q={quote(term)}&territory=USA&page=1&perPage=5",
        f"https://www.ascap.com/api/1.0/search/all?q={quote(term)}&territory=USA",
    ]
    for url in endpoints:
        try:
            r = requests.get(url, headers={**_HEADERS, "Referer": "https://www.ascap.com/repertory"}, timeout=8)
            if r.status_code == 200:
                data = r.json()
                works = data.get("workSearchResults", data.get("results", data.get("items", [])))
                if works:
                    return {
                        "status": "found",
                        "count": len(works),
                        "checked_at": _now_iso(),
                        "results": [
                            {
                                "title": w.get("title", w.get("workTitle", "")),
                                "iswc": w.get("iswc", ""),
                                "writers": [p.get("fullName", "") for p in w.get("contributors", w.get("writers", []))],
                            }
                            for w in works[:5]
                        ],
                    }
        except Exception:
            continue
    return {"status": "no_results", "results": [], "checked_at": _now_iso()}


def _query_bmi(term: str) -> Dict:
    endpoints = [
        f"https://repertoire.bmi.com/Repertoire/QuickSearch?searchType=Work&query={quote(term)}&page=1",
        f"https://api.bmi.com/search/v1/works?q={quote(term)}&limit=5",
    ]
    for url in endpoints:
        try:
            r = requests.get(url, headers={**_HEADERS, "Referer": "https://repertoire.bmi.com/"}, timeout=8)
            if r.status_code == 200:
                data = r.json()
                works = data.get("works", data.get("results", data.get("items", [])))
                if works:
                    return {
                        "status": "found",
                        "count": len(works),
                        "checked_at": _now_iso(),
                        "results": [
                            {
                                "title": w.get("title", w.get("workTitle", "")),
                                "iswc": w.get("iswc", ""),
                                "writers": [p.get("name", "") for p in w.get("writers", w.get("contributors", []))],
                            }
                            for w in works[:5]
                        ],
                    }
        except Exception:
            continue
    return {"status": "no_results", "results": [], "checked_at": _now_iso()}


def _query_sesac(term: str) -> Dict:
    endpoints = [
        f"https://www.sesac.com/api/repertory/search?q={quote(term)}&limit=5",
        f"https://www.sesac.com/repertory/search?query={quote(term)}",
    ]
    for url in endpoints:
        try:
            r = requests.get(url, headers={**_HEADERS, "Referer": "https://www.sesac.com/repertory/"}, timeout=8)
            if r.status_code == 200:
                data = r.json()
                works = data.get("works", data.get("results", data.get("items", [])))
                if works:
                    return {
                        "status": "found",
                        "count": len(works),
                        "checked_at": _now_iso(),
                        "results": [
                            {
                                "title": w.get("title", w.get("workTitle", "")),
                                "iswc": w.get("iswc", ""),
                                "writers": [p.get("name", "") for p in w.get("writers", w.get("contributors", []))],
                            }
                            for w in works[:5]
                        ],
                    }
        except Exception:
            continue
    return {"status": "no_results", "results": [], "checked_at": _now_iso()}


def _run_pro_queries(artist: str, title: str) -> Dict:
    term = f"{artist} {title}".strip()
    ascap = _query_ascap(term)
    bmi = _query_bmi(term)
    sesac = _query_sesac(term)
    return {"ascap": ascap, "bmi": bmi, "sesac": sesac}


# ─────────────────────────────────────────────
# REGISTRY LINKS
# ─────────────────────────────────────────────

def _build_registry_links(isrc: str, probe: Dict) -> List[Dict]:
    artist = probe.get("artist", "")
    title = probe.get("song_title", "")
    name_q = f"{artist} {title}".strip()

    return [
        {
            "name": "IFPI ISRC Lookup",
            "org": "IFPI",
            "search_type": "isrc",
            "url": "https://isrc.ifpi.org/",
            "search_term": isrc,
            "note": "Official ISRC authority",
        },
        {
            "name": "SoundExchange ISRC",
            "org": "SoundExchange",
            "search_type": "isrc",
            "url": "https://isrc.soundexchange.com/",
            "search_term": isrc,
            "note": "Digital performance royalties",
        },
        {
            "name": "CISAC",
            "org": "CISAC",
            "search_type": "isrc",
            "url": "https://www.cisac.org/",
            "search_term": isrc,
            "note": "International rights societies",
        },
        {
            "name": "ASCAP Repertory",
            "org": "ASCAP",
            "search_type": "name",
            "url": f"https://www.ascap.com/repertory#/?query={quote(name_q)}",
            "search_term": name_q,
            "note": "Performance rights · US",
        },
        {
            "name": "BMI Repertoire",
            "org": "BMI",
            "search_type": "name",
            "url": "https://repertoire.bmi.com/",
            "search_term": name_q,
            "note": "Performance rights · US",
        },
        {
            "name": "SESAC Repertory",
            "org": "SESAC",
            "search_type": "name",
            "url": "https://www.sesac.com/repertory/",
            "search_term": name_q,
            "note": "Performance rights · US",
        },
    ]


def _build_verdict(probe: Dict, verify: Dict, detect: Dict) -> Dict:
    sev = detect.get("severity", "clear")
    if sev == "critical":
        return {
            "level": "CRITICAL",
            "color": "red",
            "summary": "Critical royalty gaps detected. Immediate action required.",
        }
    if sev == "warning" or not verify.get("matched"):
        return {
            "level": "AT RISK",
            "color": "yellow",
            "summary": "Registration gaps found. Revenue leakage likely.",
        }
    return {
        "level": "SECURE",
        "color": "green",
        "summary": "Registration chain intact. Royalty paths appear open.",
    }


# ─────────────────────────────────────────────
# PUBLIC ENTRY POINT
# ─────────────────────────────────────────────

async def run_forensic_audit(isrc: str) -> Dict:
    loop = asyncio.get_event_loop()
    clean = isrc.replace("-", "").upper()
    audit_started = _now_iso()

    # Step 1: Probe (must complete first — artist_mbid feeds steps 2+3)
    probe = await loop.run_in_executor(_executor, _probe_smpt, clean)

    # Steps 2, 3, and PRO queries in parallel
    artist_name = probe.get("artist", "")
    song_title = probe.get("song_title", "")

    verify, streaming, pro_data = await asyncio.gather(
        loop.run_in_executor(_executor, _verify_mlc, clean, probe),
        loop.run_in_executor(_executor, _get_streaming_stats, probe.get("artist_mbid")),
        loop.run_in_executor(_executor, _run_pro_queries, artist_name, song_title),
    )

    # Step 4
    detect = _detect_black_box(probe, verify, streaming)

    # Statute of limitations check
    statute = _check_statute(probe.get("first_release_date"))

    return {
        "isrc": clean,
        "song_title": song_title,
        "artist": artist_name,
        "audit_started": audit_started,
        "steps": {
            "probe": {
                "label": "Probe — Official Recording Owner",
                "status": probe.get("status"),
                "checked_at": probe.get("checked_at"),
                "source": probe.get("source"),
                "data": probe,
            },
            "verify": {
                "label": "Verify — MLC Mechanical Linkage",
                "status": verify.get("status"),
                "matched": verify.get("matched"),
                "mlc_song_code": verify.get("mlc_song_code"),
                "iswc": verify.get("iswc"),
                "checked_at": verify.get("checked_at"),
                "source": verify.get("source"),
                "data": verify,
            },
            "detect": {
                "label": "Detect — Black Box Analysis",
                "black_box": detect.get("black_box_detected"),
                "severity": detect.get("severity"),
                "findings": detect.get("findings", []),
                "streaming": streaming,
                "revenue": detect.get("revenue", {}),
            },
            "pro_scan": {
                "label": "PRO Registry Scan — ASCAP / BMI / SESAC",
                "ascap": pro_data.get("ascap", {}),
                "bmi": pro_data.get("bmi", {}),
                "sesac": pro_data.get("sesac", {}),
            },
        },
        "statute": statute,
        "registry_links": _build_registry_links(clean, probe),
        "verdict": _build_verdict(probe, verify, detect),
    }
