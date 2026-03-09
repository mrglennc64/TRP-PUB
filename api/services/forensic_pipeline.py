"""
Forensic Royalty Pipeline
─────────────────────────
HONEST DATA SOURCES:
  Step 1  PROBE    — MusicBrainz: real ISRC → recording metadata, ISWC, IPI
  Step 1b DISCOGS  — Discogs API: real ISRC → release metadata, label, genre
  Step 2  STREAMS  — ListenBrainz: recording-level listen count (real data)
  Step 3  DETECT   — Gap analysis from confirmed SMPT data only (no fake API calls)
  Step 4  MANUAL   — Pre-filled deep links for MLC / ASCAP / BMI / SESAC / SoundExchange

NOTE: MLC, ASCAP, BMI, SESAC have no public APIs.
      We do NOT fake these checks. We surface the gaps we CAN confirm,
      then give attorneys pre-filled links to verify the rest.
"""
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Dict, List, Optional
from urllib.parse import quote

import requests

logger = logging.getLogger(__name__)
_executor = ThreadPoolExecutor(max_workers=4)

_HEADERS = {
    "User-Agent": "TrapRoyaltiesPro/1.0 (contact@traproyaltiespro.com)",
    "Accept": "application/json",
}

# Revenue rate constants (per stream)
_RATE_LOW  = 0.0007   # conservative mechanical only
_RATE_MID  = 0.003    # industry average blended
_RATE_HIGH = 0.004    # full stack

_SOL_URGENT_YEARS  = 3.0
_SOL_WARNING_YEARS = 2.5


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")


# ─────────────────────────────────────────────
# STEP 1 · PROBE — MusicBrainz (only real open registry)
# ─────────────────────────────────────────────

def _probe_smpt(isrc: str) -> Dict:
    """Query MusicBrainz for real recording metadata via ISRC."""
    try:
        import musicbrainzngs as mb
        mb.set_useragent("TrapRoyaltiesPro", "1.0", "contact@traproyaltiespro.com")

        result = mb.search_recordings(isrc=isrc, limit=1)
        recordings = result.get("recording-list", [])

        if not recordings:
            return {
                "status": "not_found",
                "message": "ISRC not found in MusicBrainz global registry.",
                "what_this_means": "Either the ISRC was never submitted to MusicBrainz, or it was issued by a distributor that does not share data publicly. This does not mean the song doesn't exist — it means there is no open registry record.",
                "checked_at": _now_iso(),
                "source": "MusicBrainz (musicbrainz.org)",
            }

        rec = recordings[0]
        recording_id = rec.get("id")
        song_title = rec.get("title", "Unknown")
        duration_ms = rec.get("length")
        first_release_date = rec.get("first-release-date")

        artist_name, artist_mbid = "Unknown", None
        if rec.get("artist-credit"):
            ac = rec["artist-credit"][0]
            if isinstance(ac, dict) and ac.get("artist"):
                a = ac["artist"]
                artist_name = a.get("name", "Unknown")
                artist_mbid = a.get("id")

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
            "source": "MusicBrainz (musicbrainz.org)",
        }

    except Exception as e:
        logger.error(f"PROBE error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "checked_at": _now_iso(),
            "source": "MusicBrainz (musicbrainz.org)",
        }


# ─────────────────────────────────────────────
# STEP 1b · DISCOGS — Real release database (public API, token optional)
# ─────────────────────────────────────────────

def _probe_discogs(isrc: str, artist: str = "", title: str = "") -> Dict:
    """Query Discogs for real release metadata via ISRC, with artist/title fallback."""
    import os
    token = os.getenv("DISCOGS_TOKEN")
    base = "https://api.discogs.com"
    headers = {"User-Agent": "TrapRoyaltiesPro/1.0 (traproyaltiespro.com)"}

    try:
        # Primary: ISRC lookup
        params: Dict = {"type": "release", "track_isrc": isrc}
        if token:
            params["token"] = token
        r = requests.get(f"{base}/database/search", params=params, headers=headers, timeout=8)
        if r.status_code == 200:
            results = r.json().get("results", [])
            if results:
                r0 = results[0]
                return {
                    "status": "found",
                    "title": r0.get("title"),
                    "label": (r0.get("label") or [None])[0],
                    "release_date": str(r0.get("year", "")),
                    "genres": r0.get("genre", []),
                    "styles": r0.get("style", []),
                    "country": r0.get("country"),
                    "result_count": len(results),
                    "checked_at": _now_iso(),
                    "source": "Discogs (discogs.com)",
                }

        # Fallback: artist + title search
        if artist or title:
            params2: Dict = {"type": "release"}
            if artist:
                params2["artist"] = artist
            if title:
                params2["track"] = title
            if token:
                params2["token"] = token
            r2 = requests.get(f"{base}/database/search", params=params2, headers=headers, timeout=8)
            if r2.status_code == 200:
                results2 = r2.json().get("results", [])
                if results2:
                    r0 = results2[0]
                    return {
                        "status": "found_by_name",
                        "title": r0.get("title"),
                        "label": (r0.get("label") or [None])[0],
                        "release_date": str(r0.get("year", "")),
                        "genres": r0.get("genre", []),
                        "styles": r0.get("style", []),
                        "country": r0.get("country"),
                        "result_count": len(results2),
                        "note": "Found by artist/title — ISRC not indexed in Discogs",
                        "checked_at": _now_iso(),
                        "source": "Discogs (discogs.com)",
                    }

        return {
            "status": "not_found",
            "message": "ISRC not indexed in Discogs database.",
            "checked_at": _now_iso(),
            "source": "Discogs (discogs.com)",
        }

    except Exception as e:
        logger.error(f"Discogs probe error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "checked_at": _now_iso(),
            "source": "Discogs (discogs.com)",
        }


# ─────────────────────────────────────────────
# STEP 2 · STREAMS — ListenBrainz (real listen data)
# Recording-level first, artist-level fallback
# ─────────────────────────────────────────────

def _get_streaming_stats(recording_id: Optional[str], artist_mbid: Optional[str]) -> Dict:
    """
    Try recording-level listen stats first (more accurate for attorneys).
    Falls back to artist-level if recording MBID not available.
    """
    # Try recording-level first
    if recording_id:
        try:
            r = requests.get(
                f"https://api.listenbrainz.org/1/popularity/recording",
                params={"recording_mbid": recording_id},
                timeout=5,
            )
            if r.status_code == 200:
                data = r.json()
                if data and isinstance(data, list) and len(data) > 0:
                    return {
                        "total_listens": data[0].get("total_listen_count", 0),
                        "unique_listeners": data[0].get("total_user_count", 0),
                        "data_level": "recording",
                        "checked_at": _now_iso(),
                        "source": "ListenBrainz (listenbrainz.org) — recording-level",
                    }
            # Try alternate endpoint
            r2 = requests.get(
                "https://api.listenbrainz.org/1/stats/recording",
                params={"recording_mbid": recording_id, "count": 1},
                timeout=5,
            )
            if r2.status_code == 200:
                data2 = r2.json()
                recordings = data2.get("payload", {}).get("recordings", [])
                if recordings:
                    return {
                        "total_listens": recordings[0].get("listen_count", 0),
                        "unique_listeners": 0,
                        "data_level": "recording",
                        "checked_at": _now_iso(),
                        "source": "ListenBrainz (listenbrainz.org) — recording-level",
                    }
        except Exception:
            pass

    # Fallback: artist-level (labeled honestly)
    if artist_mbid:
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
                        "data_level": "artist",
                        "data_note": "Artist-level estimate — actual track listens may be lower",
                        "checked_at": _now_iso(),
                        "source": "ListenBrainz (listenbrainz.org) — artist-level estimate",
                    }
        except Exception:
            pass

    return {
        "total_listens": 0,
        "unique_listeners": 0,
        "data_level": "none",
        "checked_at": _now_iso(),
        "source": "ListenBrainz (listenbrainz.org)",
    }


# ─────────────────────────────────────────────
# STATUTE OF LIMITATIONS CHECK
# ─────────────────────────────────────────────

def _check_statute(first_release_date: Optional[str]) -> Optional[Dict]:
    """17 U.S.C. § 507(b): 3-year civil copyright statute of limitations."""
    if not first_release_date:
        return None
    try:
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
                    "Under 17 U.S.C. § 507(b), the 3-year civil copyright statute "
                    "of limitations may have passed for claims predating this window. "
                    "File immediately or consult counsel regarding tolling arguments."
                ),
                "release_date": first_release_date,
                "age_years": round(age_years, 1),
            }
        elif age_years >= _SOL_WARNING_YEARS:
            remaining_months = round((_SOL_URGENT_YEARS - age_years) * 12)
            return {
                "level": "warning",
                "label": f"STATUTE WARNING — ~{remaining_months} months remaining",
                "color": "yellow",
                "message": (
                    f"This recording is {age_years:.1f} years old. "
                    f"Approximately {remaining_months} months remain before the 3-year "
                    "statute of limitations (17 U.S.C. § 507(b)) may limit recovery. "
                    "Prioritize this claim."
                ),
                "release_date": first_release_date,
                "age_years": round(age_years, 1),
            }
        return None
    except Exception:
        return None


# ─────────────────────────────────────────────
# STEP 3 · DETECT — Real gap analysis from confirmed data only
# ─────────────────────────────────────────────

def _detect_gaps(probe: Dict, streaming: Dict) -> Dict:
    """
    Detect gaps from CONFIRMED data sources only.
    We do NOT flag MLC/ASCAP/BMI as 'not found' because we never actually connected.
    We surface what MusicBrainz tells us is missing.
    """
    findings: List[Dict] = []

    is_registered = probe.get("status") == "found"
    has_iswc = bool(probe.get("iswc"))
    has_ipi = bool(probe.get("ipi"))
    has_work_rel = probe.get("has_work_relationship", False)
    listens = streaming.get("total_listens", 0)
    data_level = streaming.get("data_level", "none")

    revenue_low  = round(listens * _RATE_LOW)
    revenue_mid  = round(listens * _RATE_MID)
    revenue_high = round(listens * _RATE_HIGH)

    if is_registered and has_iswc and has_ipi:
        confidence = 1.0
        confidence_label = "HIGH — ISRC registered, ISWC present, IPI on record"
    elif is_registered and (has_iswc or has_ipi):
        confidence = 0.75
        confidence_label = "MEDIUM — Partial registration data"
    elif is_registered:
        confidence = 0.5
        confidence_label = "LOW — Recording found but composition identifiers missing"
    else:
        confidence = 0.2
        confidence_label = "VERY LOW — No open registry record found"

    severity_rank = {"clear": 0, "warning": 1, "critical": 2}
    severity = "clear"

    def bump(s: str):
        nonlocal severity
        if severity_rank[s] > severity_rank[severity]:
            severity = s

    # ── NOT IN REGISTRY AT ALL
    if not is_registered:
        bump("critical")
        findings.append({
            "type": "not_registered",
            "severity": "critical",
            "title": "ISRC Not Found in Global Registry",
            "description": "This ISRC has no record in MusicBrainz. Without a global registry record, royalty collection paths — streaming, mechanical, and performance — are all at risk.",
            "action": "Confirm the ISRC is correct. If correct, register through a distributor that submits ISRCs to MusicBrainz (DistroKid, TuneCore, CD Baby).",
            "what_attorney_should_do": "Obtain proof of ISRC registration from the distributor. If none exists, this is evidence of improper registration.",
            "checked_at": probe.get("checked_at"),
            "source": probe.get("source"),
        })

    # ── NO ISWC (composition not linked)
    if is_registered and not has_iswc:
        bump("warning")
        findings.append({
            "type": "missing_iswc",
            "severity": "warning",
            "title": "No ISWC — Composition Not Linked",
            "description": "The recording exists in the global registry but is not linked to a composition work (ISWC). Without this link, mechanical royalties from streaming cannot be attributed to the correct publisher or songwriter.",
            "action": "Register the composition with a PRO (ASCAP/BMI/SESAC) to obtain an ISWC, then link it to this recording.",
            "what_attorney_should_do": "Request ISWC documentation from the publisher. Absence of ISWC is a direct cause of unpaid mechanical royalties.",
            "confirmed_by": "MusicBrainz — no work relationship found for this recording",
            "checked_at": probe.get("checked_at"),
            "source": probe.get("source"),
        })

    # ── NO IPI (performance royalties can't route)
    if is_registered and not has_ipi:
        bump("warning")
        findings.append({
            "type": "missing_ipi",
            "severity": "warning",
            "title": "No IPI Number — Performance Royalties Unattributable",
            "description": "No IPI (Interested Party Information) number is on record for this artist. PROs use IPI to route performance royalties. Without it, ASCAP, BMI, SESAC, and international PROs cannot attribute earnings.",
            "action": "Register with a PRO (ASCAP/BMI/SESAC) to receive an IPI number.",
            "what_attorney_should_do": "Verify whether the artist is registered with any PRO. If not, all performance royalties since release may be in a holding pool.",
            "confirmed_by": "MusicBrainz — no IPI on record for artist MBID",
            "checked_at": probe.get("checked_at"),
            "source": probe.get("source"),
        })

    # ── NO WORK RELATIONSHIP (recording not tied to composition)
    if is_registered and not has_work_rel and has_iswc is False:
        # Only add if not already caught by missing_iswc
        pass

    # ── STREAM EVIDENCE (informational — not a gap, but supports claim value)
    if listens > 0 and is_registered and (not has_iswc or not has_ipi):
        data_note = streaming.get("data_note", "")
        bump("critical" if listens > 100_000 else "warning")
        findings.append({
            "type": "stream_gap",
            "severity": "critical" if listens > 100_000 else "warning",
            "title": f"Active Streams With Registration Gaps — Est. ${revenue_low:,}–${revenue_high:,} at Risk",
            "description": (
                f"{listens:,} documented {'artist-level ' if data_level == 'artist' else ''}listens confirmed on ListenBrainz. "
                f"Combined with the registration gaps above, this recording has likely generated royalties that cannot be routed to the correct owner."
                + (f" Note: {data_note}" if data_note else "")
            ),
            "action": "Cross-reference stream count with distributor royalty statements to quantify the gap between earned and paid.",
            "what_attorney_should_do": "Subpoena or request royalty statements from distributor and compare against ListenBrainz stream evidence. The difference is the claim amount.",
            "estimated_low": revenue_low,
            "estimated_high": revenue_high,
            "checked_at": streaming.get("checked_at"),
            "source": streaming.get("source"),
        })

    return {
        "black_box_detected": (not has_iswc or not has_ipi) and listens > 0 and is_registered,
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
# STEP 4 · MANUAL VERIFICATION CHECKLIST
# Pre-filled deep links — honest about what requires human verification
# ─────────────────────────────────────────────

def _build_manual_checklist(isrc: str, probe: Dict) -> List[Dict]:
    """
    These registries have no public APIs.
    We give attorneys pre-filled search links — not fake API results.
    """
    artist = probe.get("artist", "")
    title = probe.get("song_title", "")
    name_q = f"{artist} {title}".strip()
    enc_name = quote(name_q)
    enc_isrc = quote(isrc)

    return [
        {
            "registry": "The MLC",
            "purpose": "US Mechanical Royalties",
            "check": "Is this work registered and matched in the MLC database?",
            "url": f"https://search.themlc.com/works?query={enc_name}",
            "search_term": name_q,
            "status": "manual_required",
            "why_manual": "The MLC has no public API. Search must be performed manually.",
            "what_to_look_for": "Match Status should say 'Matched'. If 'Unmatched' or not found, mechanical royalties cannot be distributed.",
        },
        {
            "registry": "ASCAP",
            "purpose": "Performance Royalties (US)",
            "check": "Is the composition registered with ASCAP?",
            "url": f"https://www.ascap.com/repertory#/?query={enc_name}",
            "search_term": name_q,
            "status": "manual_required",
            "why_manual": "ASCAP repertory has no public API.",
            "what_to_look_for": "Find the work, confirm writer shares add to 100%, and verify IPI numbers match.",
        },
        {
            "registry": "BMI",
            "purpose": "Performance Royalties (US)",
            "check": "Is the composition registered with BMI?",
            "url": f"https://repertoire.bmi.com/",
            "search_term": name_q,
            "status": "manual_required",
            "why_manual": "BMI repertoire has no public API.",
            "what_to_look_for": "Confirm work registration and that ownership shares are complete.",
        },
        {
            "registry": "SoundExchange",
            "purpose": "Digital Performance Royalties",
            "check": "Is this ISRC registered with SoundExchange for non-interactive streaming?",
            "url": f"https://isrc.soundexchange.com/#!/isrc/{enc_isrc}",
            "search_term": isrc,
            "status": "manual_required",
            "why_manual": "SoundExchange ISRC lookup is a manual portal.",
            "what_to_look_for": "Confirm ISRC is claimed. If unclaimed, digital performance royalties (Pandora, SiriusXM, etc.) are in a black box.",
        },
        {
            "registry": "SESAC",
            "purpose": "Performance Royalties (US)",
            "check": "Is the composition registered with SESAC?",
            "url": f"https://www.sesac.com/repertory/",
            "search_term": name_q,
            "status": "manual_required",
            "why_manual": "SESAC repertory has no public API.",
            "what_to_look_for": "Only relevant if the artist is a SESAC member. Verify registration and splits.",
        },
    ]


def _build_registry_links(isrc: str, probe: Dict) -> List[Dict]:
    artist = probe.get("artist", "")
    title = probe.get("song_title", "")
    name_q = f"{artist} {title}".strip()

    return [
        {"name": "IFPI ISRC Lookup", "org": "IFPI", "url": "https://isrc.ifpi.org/", "search_term": isrc, "note": "Official ISRC authority"},
        {"name": "SoundExchange ISRC", "org": "SoundExchange", "url": f"https://isrc.soundexchange.com/#!/isrc/{quote(isrc)}", "search_term": isrc, "note": "Digital performance royalties"},
        {"name": "CISAC", "org": "CISAC", "url": "https://www.cisac.org/", "search_term": isrc, "note": "International rights societies"},
        {"name": "ASCAP Repertory", "org": "ASCAP", "url": f"https://www.ascap.com/repertory#/?query={quote(name_q)}", "search_term": name_q, "note": "Performance rights · US"},
        {"name": "BMI Repertoire", "org": "BMI", "url": "https://repertoire.bmi.com/", "search_term": name_q, "note": "Performance rights · US"},
        {"name": "SESAC Repertory", "org": "SESAC", "url": "https://www.sesac.com/repertory/", "search_term": name_q, "note": "Performance rights · US"},
        {"name": "The MLC Search", "org": "MLC", "url": f"https://search.themlc.com/works?query={quote(name_q)}", "search_term": name_q, "note": "US mechanical royalties"},
    ]


def _build_verdict(probe: Dict, detect: Dict) -> Dict:
    sev = detect.get("severity", "clear")
    is_registered = probe.get("status") == "found"
    has_iswc = bool(probe.get("iswc"))
    has_ipi = bool(probe.get("ipi"))

    if not is_registered:
        return {"level": "CRITICAL", "color": "red", "summary": "ISRC not found in any open registry. All royalty paths are at risk."}
    if sev == "critical":
        return {"level": "CRITICAL", "color": "red", "summary": "Active streams confirmed with registration gaps. Royalties likely uncollected."}
    if sev == "warning" or not has_iswc or not has_ipi:
        return {"level": "AT RISK", "color": "yellow", "summary": "Registration gaps found. Manual verification of MLC and PRO records required."}
    return {"level": "REGISTERED", "color": "green", "summary": "Recording found with ISWC and IPI on record. Verify MLC and PRO status manually."}


# ─────────────────────────────────────────────
# PUBLIC ENTRY POINT
# ─────────────────────────────────────────────

async def run_forensic_audit(isrc: str) -> Dict:
    loop = asyncio.get_event_loop()
    clean = isrc.replace("-", "").upper()
    audit_started = _now_iso()

    # Step 1: Probe MusicBrainz
    probe = await loop.run_in_executor(_executor, _probe_smpt, clean)

    # Step 1b: Discogs — run in parallel with streams
    probe_artist = probe.get("artist", "")
    probe_title = probe.get("song_title", "")

    # Step 2: Stream stats (recording-level if we have MBID, artist-level fallback)
    recording_id = probe.get("recording_id")
    artist_mbid = probe.get("artist_mbid")

    # Run Discogs + ListenBrainz in parallel
    streaming, discogs = await asyncio.gather(
        loop.run_in_executor(_executor, _get_streaming_stats, recording_id, artist_mbid),
        loop.run_in_executor(_executor, _probe_discogs, clean, probe_artist, probe_title),
    )

    # Step 3: Gap detection from confirmed data only
    detect = _detect_gaps(probe, streaming)

    # Step 4: Manual verification checklist
    manual_checklist = _build_manual_checklist(clean, probe)

    # Statute check
    statute = _check_statute(probe.get("first_release_date"))

    artist_name = probe_artist
    song_title = probe_title

    return {
        "isrc": clean,
        "song_title": song_title,
        "artist": artist_name,
        "audit_started": audit_started,
        "steps": {
            "probe": {
                "label": "Step 1 — ISRC Registry Probe (MusicBrainz)",
                "status": probe.get("status"),
                "checked_at": probe.get("checked_at"),
                "source": probe.get("source"),
                "data": probe,
            },
            "discogs": {
                "label": "Step 1b — Discogs Release Database",
                "status": discogs.get("status"),
                "checked_at": discogs.get("checked_at"),
                "source": discogs.get("source"),
                "data": discogs,
            },
            "streams": {
                "label": "Step 2 — Stream Activity (ListenBrainz)",
                "total_listens": streaming.get("total_listens", 0),
                "unique_listeners": streaming.get("unique_listeners", 0),
                "data_level": streaming.get("data_level", "none"),
                "data_note": streaming.get("data_note", ""),
                "checked_at": streaming.get("checked_at"),
                "source": streaming.get("source"),
            },
            "detect": {
                "label": "Step 3 — Confirmed Gap Analysis",
                "black_box": detect.get("black_box_detected"),
                "severity": detect.get("severity"),
                "findings": detect.get("findings", []),
                "streaming": streaming,
                "revenue": detect.get("revenue", {}),
            },
            "manual_checklist": {
                "label": "Step 4 — Manual Verification Required",
                "note": "These registries have no public APIs. Each link is pre-filled for the attorney to verify.",
                "items": manual_checklist,
            },
            # Keep verify/pro_scan keys for backward compat with frontend
            "verify": {
                "label": "MLC — Manual Verification Required",
                "status": "manual_required",
                "matched": None,
                "mlc_song_code": None,
                "iswc": probe.get("iswc"),
                "checked_at": audit_started,
                "source": "Manual verification required — no public MLC API",
                "data": {"match_status": "NOT CHECKED — verify manually at search.themlc.com"},
            },
            "pro_scan": {
                "label": "PRO Scan — Manual Verification Required",
                "ascap": {"status": "manual_required", "results": []},
                "bmi": {"status": "manual_required", "results": []},
                "sesac": {"status": "manual_required", "results": []},
            },
        },
        "statute": statute,
        "manual_checklist": manual_checklist,
        "registry_links": _build_registry_links(clean, probe),
        "verdict": _build_verdict(probe, detect),
    }
