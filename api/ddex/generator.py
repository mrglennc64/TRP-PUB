"""
DDEX ERN Generator for TrapRoyaltiesPro
Generates ERN 3.8 and 4.3 compliant XML without external dependencies.
Connects to Digital Handshake (PartyList) and Split Verification (DealList).
"""

import hashlib
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


ERN_NAMESPACES = {
    "4.3": {
        "xmlns": "http://ddex.net/xml/ern/43",
        "xmlns:xs": "http://www.w3.org/2001/XMLSchema-instance",
        "xs:schemaLocation": "http://ddex.net/xml/ern/43 http://ddex.net/xml/ern/43/release-notification.xsd",
        "MessageSchemaVersionId": "ern/43",
    },
    "3.8": {
        "xmlns": "http://ddex.net/xml/ern/382",
        "xmlns:xs": "http://www.w3.org/2001/XMLSchema-instance",
        "xs:schemaLocation": "http://ddex.net/xml/ern/382 http://ddex.net/xml/ern/382/release-notification.xsd",
        "MessageSchemaVersionId": "ern/382",
    },
}


def _pretty_xml(element: Element) -> str:
    raw = tostring(element, encoding="unicode")
    return minidom.parseString(raw).toprettyxml(indent="  ", encoding=None)


class DDEXGenerator:
    """
    Generates DDEX ERN XML from TrapRoyaltiesPro release data.
    Data flows: Digital Handshake -> PartyList, Splits -> DealList.
    """

    def __init__(self, version: str = "4.3"):
        if version not in ERN_NAMESPACES:
            raise ValueError(f"Unsupported DDEX version: {version}. Choose '4.3' or '3.8'.")
        self.version = version

    def generate(self, release_data: Dict) -> Dict:
        """
        Generate DDEX ERN XML for a release.
        Returns dict with xml, hash, message_id.
        """
        message_id = f"TRP-{release_data.get('id', str(uuid.uuid4())[:8])}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        ns = ERN_NAMESPACES[self.version]

        root = Element("NewReleaseMessage")
        for attr, val in ns.items():
            root.set(attr, val)
        root.set("LanguageAndScriptCode", "en")
        root.set("ReleaseProfileVersionId", "CommonReleaseTypes/14/AudioSingle" if self.version == "4.3" else "CommonReleaseTypes/13/AudioSingle")

        self._add_message_header(root, message_id, release_data)
        self._add_update_indicator(root)
        self._add_party_list(root, release_data)
        self._add_resource_list(root, release_data)
        self._add_release_list(root, release_data, message_id)
        self._add_deal_list(root, release_data)

        xml_str = _pretty_xml(root)
        sha256 = hashlib.sha256(xml_str.encode()).hexdigest()

        return {
            "xml": xml_str,
            "hash": sha256,
            "message_id": message_id,
            "version": self.version,
            "generated_at": datetime.utcnow().isoformat(),
        }

    # ------------------------------------------------------------------
    # Message Header
    # ------------------------------------------------------------------

    def _add_message_header(self, root: Element, message_id: str, data: Dict):
        header = SubElement(root, "MessageHeader")
        SubElement(header, "MessageThreadId").text = message_id
        SubElement(header, "MessageId").text = message_id
        SubElement(header, "MessageSender").text = data.get("label_name", "Unknown Label")

        sender_dpid = SubElement(header, "SenderPartyId")
        sender_dpid.text = data.get("label_dpid", "PADPIDAZZZZXXXXXXU")

        SubElement(header, "MessageRecipient").text = "TrapRoyaltiesPro Distribution"
        SubElement(header, "MessageCreatedDateTime").text = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
        SubElement(header, "MessageControlType").text = "LiveMessage"

    def _add_update_indicator(self, root: Element):
        SubElement(root, "UpdateIndicator").text = "OriginalMessage"

    # ------------------------------------------------------------------
    # PartyList — sourced from Digital Handshake data
    # ------------------------------------------------------------------

    def _add_party_list(self, root: Element, data: Dict):
        party_list = SubElement(root, "PartyList")

        # Main artist
        artist_party = SubElement(party_list, "Party")
        SubElement(artist_party, "PartyReference").text = f"P{data.get('artist_id', '001')}"
        artist_name_el = SubElement(artist_party, "PartyName")
        SubElement(artist_name_el, "FullName").text = data.get("artist", "Unknown Artist")
        if data.get("artist_isni"):
            isni_el = SubElement(artist_party, "PartyId")
            SubElement(isni_el, "ISNI").text = data["artist_isni"]
        if data.get("artist_dpid"):
            dpid_el = SubElement(artist_party, "PartyId")
            SubElement(dpid_el, "DPID").text = data["artist_dpid"]

        # Label
        label_party = SubElement(party_list, "Party")
        SubElement(label_party, "PartyReference").text = f"P{data.get('label_id', '002')}"
        label_name_el = SubElement(label_party, "PartyName")
        SubElement(label_name_el, "FullName").text = data.get("label_name", "Unknown Label")
        if data.get("label_dpid"):
            ldpid_el = SubElement(label_party, "PartyId")
            SubElement(ldpid_el, "DPID").text = data["label_dpid"]

        # Contributors from split/handshake
        for idx, contributor in enumerate(data.get("contributors", []), start=3):
            contrib_party = SubElement(party_list, "Party")
            SubElement(contrib_party, "PartyReference").text = f"P{contributor.get('id', str(idx).zfill(3))}"
            cname_el = SubElement(contrib_party, "PartyName")
            SubElement(cname_el, "FullName").text = contributor.get("name", "")
            if contributor.get("isni"):
                cisni_el = SubElement(contrib_party, "PartyId")
                SubElement(cisni_el, "ISNI").text = contributor["isni"]
            if contributor.get("ipi"):
                cipi_el = SubElement(contrib_party, "PartyId")
                SubElement(cipi_el, "IPI").text = contributor["ipi"]

    # ------------------------------------------------------------------
    # ResourceList — Sound Recordings
    # ------------------------------------------------------------------

    def _add_resource_list(self, root: Element, data: Dict):
        resource_list = SubElement(root, "ResourceList")

        tracks = data.get("tracks", [])
        if not tracks:
            # Treat the release itself as a single track
            tracks = [{
                "title": data.get("title", "Untitled"),
                "isrc": data.get("isrc", ""),
                "duration": data.get("duration", "PT3M00S"),
                "contributors": {},
                "featured_artists": [],
            }]

        for idx, track in enumerate(tracks, start=1):
            sr = SubElement(resource_list, "SoundRecording")
            SubElement(sr, "ResourceReference").text = f"R{idx}"
            SubElement(sr, "Type").text = "MusicalWorkSoundRecording"

            # Sound recording IDs
            sr_id = SubElement(sr, "SoundRecordingId")
            if track.get("isrc"):
                SubElement(sr_id, "ISRC").text = track["isrc"]

            ref_title = SubElement(sr, "ReferenceTitle")
            SubElement(ref_title, "TitleText").text = track.get("title", data.get("title", "Untitled"))

            SubElement(sr, "Duration").text = track.get("duration", "PT3M00S")

            # Display artists
            da = SubElement(sr, "DisplayArtist")
            da_party = SubElement(da, "PartyReference")
            da_party.text = f"P{data.get('artist_id', '001')}"
            SubElement(da, "DisplayArtistRole").text = "MainArtist"
            SubElement(da, "ArtistPartyReference").text = f"P{data.get('artist_id', '001')}"

            for feat in track.get("featured_artists", []):
                feat_da = SubElement(sr, "DisplayArtist")
                SubElement(feat_da, "PartyReference").text = f"P{feat.get('id', '')}"
                SubElement(feat_da, "DisplayArtistRole").text = "FeaturedArtist"

            # Contributors by role
            role_map = {
                "producer": "Producer",
                "songwriter": "Author",
                "composer": "Composer",
                "mixer": "Mixer",
                "engineer": "RecordingEngineer",
            }
            for role_key, ddex_role in role_map.items():
                for person in track.get("contributors", {}).get(role_key, []):
                    rc = SubElement(sr, "ResourceContributor")
                    SubElement(rc, "PartyReference").text = f"P{person.get('id', '')}"
                    SubElement(rc, "ResourceContributorRole").text = ddex_role

            # Label
            SubElement(sr, "LabelName").text = data.get("label_name", "")

            # Hash of audio file for integrity
            audio_ref = track.get("audio_file", track.get("title", ""))
            audio_hash = hashlib.sha256(audio_ref.encode()).hexdigest()
            hash_el = SubElement(sr, "HashSum")
            SubElement(hash_el, "Algorithm").text = "SHA-256"
            SubElement(hash_el, "HashSumValue").text = audio_hash

            SubElement(sr, "IsInstrumental").text = "false"
            SubElement(sr, "LanguageOfPerformance").text = track.get("language", "en")

    # ------------------------------------------------------------------
    # ReleaseList
    # ------------------------------------------------------------------

    def _add_release_list(self, root: Element, data: Dict, message_id: str):
        release_list = SubElement(root, "ReleaseList")
        release = SubElement(release_list, "Release")

        SubElement(release, "ReleaseReference").text = "R0"

        # IDs
        rel_id = SubElement(release, "ReleaseId")
        if data.get("upc"):
            SubElement(rel_id, "UPC").text = data["upc"]
        if data.get("grid"):
            SubElement(rel_id, "GRid").text = data["grid"]
        if data.get("icpn"):
            SubElement(rel_id, "ICPN").text = data["icpn"]

        ref_title = SubElement(release, "ReferenceTitle")
        SubElement(ref_title, "TitleText").text = data.get("title", "Untitled Release")

        SubElement(release, "ReleaseType").text = data.get("type", "Single")

        da = SubElement(release, "DisplayArtist")
        SubElement(da, "PartyReference").text = f"P{data.get('artist_id', '001')}"
        SubElement(da, "DisplayArtistRole").text = "MainArtist"

        SubElement(release, "LabelName").text = data.get("label_name", "")

        if data.get("release_date"):
            SubElement(release, "GlobalOriginalReleaseDate").text = data["release_date"]

        # Link resource references
        res_list_el = SubElement(release, "ReleaseResourceReferenceList")
        tracks = data.get("tracks", [{}])
        for idx in range(max(len(tracks), 1)):
            ref_el = SubElement(res_list_el, "ReleaseResourceReference")
            ref_el.text = f"R{idx + 1}"
            ref_el.set("ReleaseResourceType", "PrimaryResource")

        # Genre
        if data.get("genre"):
            genre_el = SubElement(release, "Genre")
            SubElement(genre_el, "GenreText").text = data["genre"]

        # Parental warning
        SubElement(release, "ParentalWarningType").text = data.get("parental_warning", "NotExplicit")

    # ------------------------------------------------------------------
    # DealList — sourced from Split Verification data
    # ------------------------------------------------------------------

    def _add_deal_list(self, root: Element, data: Dict):
        deal_list = SubElement(root, "DealList")

        territory_deals = data.get("territory_deals", {})
        if not territory_deals:
            territory_deals = {"Worldwide": {
                "price_type": "ConsumerPrice",
                "usage": ["Stream", "Download"],
                "start_date": data.get("release_date", datetime.now().strftime("%Y-%m-%d")),
            }}

        for deal_idx, (territory, deal_data) in enumerate(territory_deals.items(), start=1):
            release_deal = SubElement(deal_list, "ReleaseDeal")

            deal_release_ref = SubElement(release_deal, "DealReleaseReference")
            deal_release_ref.text = "R0"

            deal = SubElement(release_deal, "Deal")
            deal_terms = SubElement(deal, "DealTerms")

            comm_type = SubElement(deal_terms, "CommercialModelType")
            comm_type.text = deal_data.get("commercial_model", "SubscriptionModel")

            for usage in deal_data.get("usage", ["Stream"]):
                usage_el = SubElement(deal_terms, "Usage")
                SubElement(usage_el, "UseType").text = usage

            territory_el = SubElement(deal_terms, "TerritoryCode")
            territory_el.text = territory if territory != "Worldwide" else "Worldwide"

            validity = SubElement(deal_terms, "ValidityPeriod")
            SubElement(validity, "StartDate").text = deal_data.get(
                "start_date", data.get("release_date", datetime.now().strftime("%Y-%m-%d"))
            )
            if deal_data.get("end_date"):
                SubElement(validity, "EndDate").text = deal_data["end_date"]

            # Rights claims from split data
            for holder in deal_data.get("rights_holders", []):
                rights_claim = SubElement(deal, "RightsController")
                SubElement(rights_claim, "PartyReference").text = f"P{holder.get('id', '')}"
                SubElement(rights_claim, "RightSharePercentage").text = str(holder.get("percentage", 0))
                SubElement(rights_claim, "RightsControllerRole").text = holder.get("role", "RightsController")
