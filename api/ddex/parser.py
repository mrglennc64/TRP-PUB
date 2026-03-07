"""
DDEX DSR (Digital Sales Report) Parser for TrapRoyaltiesPro.
Parses DSR XML from DSPs and cross-checks against split agreements.
"""

import hashlib
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional


# Common DSR namespace prefixes
DSR_NS = {
    "dsr": "http://ddex.net/xml/dsr/43",
    "dsr38": "http://ddex.net/xml/dsr/38",
}


@dataclass
class SaleRecord:
    isrc: str
    track_title: str
    artist: str
    dsp: str
    territory: str
    number_of_plays: int
    amount_paid: float
    currency: str
    reporting_period: str
    use_type: str = "Stream"


@dataclass
class DSRReport:
    sender: str
    recipient: str
    reporting_period_start: str
    reporting_period_end: str
    sales: List[SaleRecord] = field(default_factory=list)
    total_reported: int = 0
    raw_hash: str = ""


@dataclass
class Discrepancy:
    isrc: str
    track_title: str
    artist: str
    platform: str
    territory: str
    reported_amount: float
    expected_amount: float
    difference: float
    reporting_period: str
    plays: int


class DSRParser:
    """
    Parses DDEX Digital Sales Reports from DSPs.
    Accepts ERN/DSR 3.x and 4.x namespace formats.
    """

    def parse_file(self, file_path: str) -> DSRReport:
        with open(file_path, "rb") as f:
            raw = f.read()
        return self._parse_bytes(raw, source=file_path)

    def parse_string(self, xml_string: str) -> DSRReport:
        return self._parse_bytes(xml_string.encode(), source="<string>")

    def _parse_bytes(self, raw: bytes, source: str) -> DSRReport:
        raw_hash = hashlib.sha256(raw).hexdigest()
        root = ET.fromstring(raw.decode("utf-8", errors="replace"))

        # Strip namespace for easier access
        tag = root.tag
        ns = ""
        if "{" in tag:
            ns = tag.split("}")[0] + "}"

        def find(el, path):
            # Try with namespace first, then without
            result = el.find(f"{ns}{path}")
            if result is None:
                result = el.find(path)
            return result

        def findall(el, path):
            result = el.findall(f"{ns}{path}")
            if not result:
                result = el.findall(path)
            return result

        def text(el, path, default=""):
            node = find(el, path)
            return node.text.strip() if node is not None and node.text else default

        # Header
        header = find(root, "MessageHeader")
        sender = text(header, "MessageSender") if header is not None else "Unknown"
        recipient = text(header, "MessageRecipient") if header is not None else ""

        period_start = ""
        period_end = ""
        sales_report_list = find(root, "SalesReportList")
        if sales_report_list is not None:
            period_el = find(sales_report_list, "SalesReportingWindowStartDate")
            period_start = period_el.text.strip() if period_el is not None else ""
            period_end_el = find(sales_report_list, "SalesReportingWindowEndDate")
            period_end = period_end_el.text.strip() if period_end_el is not None else ""

        report = DSRReport(
            sender=sender,
            recipient=recipient,
            reporting_period_start=period_start,
            reporting_period_end=period_end,
            raw_hash=raw_hash,
        )

        # Parse sales/usage records
        for usage_record in findall(root, ".//SoundRecordingDetailsByTerritory"):
            isrc = text(usage_record, "ISRC")
            title = text(usage_record, "Title/TitleText") or text(usage_record, "ReferenceTitle/TitleText")
            artist = text(usage_record, "DisplayArtistName") or text(usage_record, "ArtistName")
            territory = text(usage_record, "TerritoryCode", "Worldwide")

            for usage in findall(usage_record, "Usage"):
                use_type = text(usage, "UseType", "Stream")
                plays_text = text(usage, "NumberOfStreams") or text(usage, "NumberOfDownloads") or "0"
                amount_text = text(usage, "RoyaltyOrLicenseFee") or text(usage, "NetRevenue") or "0"
                currency = text(usage, "CurrencyCode", "USD")

                try:
                    plays = int(plays_text.replace(",", ""))
                    amount = float(amount_text.replace(",", ""))
                except (ValueError, AttributeError):
                    plays = 0
                    amount = 0.0

                period = f"{period_start} - {period_end}" if period_start else "Unknown period"

                report.sales.append(SaleRecord(
                    isrc=isrc,
                    track_title=title,
                    artist=artist,
                    dsp=sender,
                    territory=territory,
                    number_of_plays=plays,
                    amount_paid=amount,
                    currency=currency,
                    reporting_period=period,
                    use_type=use_type,
                ))

        report.total_reported = len(report.sales)
        return report


class DSRVerifier:
    """
    Cross-references DSR sale records against TrapRoyaltiesPro split agreements.
    Detects underpayments/overpayments with court-admissible SHA-256 hash tracking.
    """

    # Approximate per-stream rates by territory/platform (USD)
    STREAM_RATES = {
        "Spotify": {"default": 0.004, "US": 0.005, "UK": 0.0045},
        "Apple Music": {"default": 0.007, "US": 0.008},
        "YouTube Music": {"default": 0.002},
        "Amazon Music": {"default": 0.004},
        "default": {"default": 0.003},
    }

    def verify(
        self,
        report: DSRReport,
        splits_by_isrc: Dict[str, List[Dict]],
        label_id: int,
    ) -> Dict:
        """
        Compare each sale record against split agreements.
        Returns discrepancy report dict.
        """
        discrepancies: List[Discrepancy] = []
        matched = 0
        unmatched_isrcs = []

        for sale in report.sales:
            splits = splits_by_isrc.get(sale.isrc)
            if not splits:
                unmatched_isrcs.append(sale.isrc)
                continue
            matched += 1

            # Calculate expected based on split percentage
            platform_rates = self.STREAM_RATES.get(sale.dsp, self.STREAM_RATES["default"])
            rate = platform_rates.get(sale.territory, platform_rates.get("default", 0.003))
            total_expected = sale.number_of_plays * rate

            # Sum expected per rights holder
            label_percentage = sum(
                s.get("percentage", 0) for s in splits if s.get("role") == "label"
            )
            if label_percentage == 0:
                label_percentage = 100.0  # Default: label receives all

            expected_label = total_expected * (label_percentage / 100)

            diff = expected_label - sale.amount_paid
            if abs(diff) > 0.01:
                discrepancies.append(Discrepancy(
                    isrc=sale.isrc,
                    track_title=sale.track_title,
                    artist=sale.artist,
                    platform=sale.dsp,
                    territory=sale.territory,
                    reported_amount=sale.amount_paid,
                    expected_amount=round(expected_label, 4),
                    difference=round(diff, 4),
                    reporting_period=sale.reporting_period,
                    plays=sale.number_of_plays,
                ))

        total_underpayment = sum(d.difference for d in discrepancies if d.difference > 0)
        total_overpayment = sum(abs(d.difference) for d in discrepancies if d.difference < 0)

        # Build verification hash over the result for legal use
        result_payload = json_safe({
            "dsr_hash": report.raw_hash,
            "label_id": label_id,
            "verified_at": datetime.utcnow().isoformat(),
            "total_discrepancies": len(discrepancies),
            "total_underpayment": total_underpayment,
        })
        verification_hash = hashlib.sha256(result_payload.encode()).hexdigest()

        return {
            "dsr_sender": report.sender,
            "dsr_period": f"{report.reporting_period_start} - {report.reporting_period_end}",
            "dsr_hash": report.raw_hash,
            "verification_hash": verification_hash,
            "verified_at": datetime.utcnow().isoformat(),
            "total_sales_records": report.total_reported,
            "matched_isrcs": matched,
            "unmatched_isrcs": unmatched_isrcs[:20],
            "discrepancies_found": len(discrepancies),
            "total_underpayment_usd": round(total_underpayment, 2),
            "total_overpayment_usd": round(total_overpayment, 2),
            "discrepancies": [
                {
                    "isrc": d.isrc,
                    "track": d.track_title,
                    "artist": d.artist,
                    "platform": d.platform,
                    "territory": d.territory,
                    "plays": d.plays,
                    "reported": d.reported_amount,
                    "expected": d.expected_amount,
                    "difference": d.difference,
                    "period": d.reporting_period,
                }
                for d in discrepancies[:50]
            ],
        }


def json_safe(d: dict) -> str:
    import json
    return json.dumps(d, sort_keys=True, default=str)
