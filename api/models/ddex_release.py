"""
Pydantic models for DDEX releases, deliveries, and DSR imports.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, List, Optional, Any


# ------------------------------------------------------------------
# Release Input Models
# ------------------------------------------------------------------

class TrackContributors(BaseModel):
    producer: List[Dict[str, str]] = []
    songwriter: List[Dict[str, str]] = []
    composer: List[Dict[str, str]] = []
    mixer: List[Dict[str, str]] = []
    engineer: List[Dict[str, str]] = []


class TrackInput(BaseModel):
    title: str
    isrc: Optional[str] = None
    duration: str = "PT3M00S"  # ISO 8601 duration
    language: str = "en"
    audio_file: Optional[str] = None
    featured_artists: List[Dict[str, str]] = []
    contributors: TrackContributors = Field(default_factory=TrackContributors)


class TerritoryDeal(BaseModel):
    commercial_model: str = "SubscriptionModel"
    usage: List[str] = ["Stream", "Download"]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    rights_holders: List[Dict[str, Any]] = []


class DDEXReleaseInput(BaseModel):
    """Input data for generating a DDEX ERN message."""
    id: Optional[str] = None
    title: str
    artist: str
    artist_id: Optional[str] = "001"
    artist_isni: Optional[str] = None
    artist_dpid: Optional[str] = None
    upc: Optional[str] = None
    grid: Optional[str] = None
    icpn: Optional[str] = None
    release_date: str
    original_release_date: Optional[str] = None
    type: str = "Single"  # Single, Album, EP
    genre: Optional[str] = None
    parental_warning: str = "NotExplicit"
    label_name: str
    label_id: Optional[str] = "002"
    label_dpid: Optional[str] = None
    tracks: List[TrackInput] = []
    contributors: List[Dict[str, Any]] = []
    territory_deals: Dict[str, TerritoryDeal] = Field(default_factory=dict)
    version: str = "4.3"
    # Link to existing handshake/split
    handshake_id: Optional[str] = None
    split_agreement_id: Optional[str] = None


# ------------------------------------------------------------------
# Stored Record Models
# ------------------------------------------------------------------

class DDEXReleaseRecord(BaseModel):
    """Stored DDEX release record."""
    id: str
    release_title: str
    artist: str
    label_id: Optional[str]
    message_id: str
    version: str
    xml_hash: str
    generated_at: datetime
    delivery_status: str = "pending"  # pending, delivered, rejected
    handshake_id: Optional[str] = None
    split_agreement_id: Optional[str] = None


class DDEXDelivery(BaseModel):
    """Track delivery of a DDEX release to a DSP."""
    id: str
    release_id: str
    dsp: str  # Spotify, Apple Music, YouTube, etc.
    delivery_method: str  # FTP, SFTP, S3, API
    status: str = "pending"  # pending, sent, confirmed, rejected
    sent_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    retry_count: int = 0


class DSRImportResult(BaseModel):
    """Result of importing a DSR file."""
    id: str
    label_id: str
    dsr_sender: str
    dsr_period: str
    dsr_hash: str
    verification_hash: str
    imported_at: datetime
    total_sales_records: int
    matched_isrcs: int
    discrepancies_found: int
    total_underpayment_usd: float
    total_overpayment_usd: float


# ------------------------------------------------------------------
# API Response Models
# ------------------------------------------------------------------

class DDEXGenerateResponse(BaseModel):
    success: bool
    message_id: str
    hash: str
    version: str
    generated_at: str
    xml: Optional[str] = None  # Only included when download=True
    validation_errors: List[str] = []


class DSRVerifyResponse(BaseModel):
    success: bool
    dsr_sender: str
    dsr_period: str
    dsr_hash: str
    verification_hash: str
    verified_at: str
    total_sales_records: int
    matched_isrcs: int
    discrepancies_found: int
    total_underpayment_usd: float
    total_overpayment_usd: float
    discrepancies: List[Dict[str, Any]] = []
