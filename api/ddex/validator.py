"""
DDEX XML Validator for TrapRoyaltiesPro.
Validates ERN messages against required fields without XSD dependency.
"""

from typing import Dict, List, Tuple
import xml.etree.ElementTree as ET


REQUIRED_HEADER_FIELDS = [
    "MessageId",
    "MessageSender",
    "MessageCreatedDateTime",
    "MessageControlType",
]

REQUIRED_RELEASE_FIELDS = [
    "ReleaseReference",
    "ReferenceTitle",
    "ReleaseType",
    "DisplayArtist",
]

REQUIRED_SOUND_RECORDING_FIELDS = [
    "ResourceReference",
    "Type",
    "ReferenceTitle",
    "Duration",
]


def validate_ern(xml_string: str) -> Tuple[bool, List[str]]:
    """
    Validate an ERN XML string for required fields.
    Returns (is_valid, list_of_errors).
    """
    errors: List[str] = []

    try:
        root = ET.fromstring(xml_string)
    except ET.ParseError as e:
        return False, [f"XML parse error: {e}"]

    # Strip namespace
    tag = root.tag
    ns = ""
    if "{" in tag:
        ns = tag.split("}")[0] + "}"

    def find(el, path):
        result = el.find(f"{ns}{path}")
        if result is None:
            result = el.find(path)
        return result

    # Check root element
    root_name = tag.replace(f"{{{ns[1:-1]}}}", "") if ns else tag
    if "NewReleaseMessage" not in root_name:
        errors.append(f"Root element must be NewReleaseMessage, got: {root_name}")

    # Validate MessageHeader
    header = find(root, "MessageHeader")
    if header is None:
        errors.append("Missing required element: MessageHeader")
    else:
        for field in REQUIRED_HEADER_FIELDS:
            if find(header, field) is None:
                errors.append(f"MessageHeader missing required field: {field}")

    # Validate PartyList
    party_list = find(root, "PartyList")
    if party_list is None:
        errors.append("Missing required element: PartyList")
    else:
        parties = list(party_list) if party_list else []
        if len(parties) == 0:
            errors.append("PartyList must contain at least one Party")

    # Validate ResourceList
    resource_list = find(root, "ResourceList")
    if resource_list is None:
        errors.append("Missing required element: ResourceList")
    else:
        for field in REQUIRED_SOUND_RECORDING_FIELDS:
            for sr in (resource_list.findall(f"{ns}SoundRecording") or resource_list.findall("SoundRecording")):
                if find(sr, field) is None:
                    errors.append(f"SoundRecording missing required field: {field}")

    # Validate ReleaseList
    release_list = find(root, "ReleaseList")
    if release_list is None:
        errors.append("Missing required element: ReleaseList")
    else:
        for release in (release_list.findall(f"{ns}Release") or release_list.findall("Release")):
            for field in REQUIRED_RELEASE_FIELDS:
                if find(release, field) is None:
                    errors.append(f"Release missing required field: {field}")

    # Validate DealList
    deal_list = find(root, "DealList")
    if deal_list is None:
        errors.append("Missing required element: DealList")

    is_valid = len(errors) == 0
    return is_valid, errors


def validate_release_data(data: Dict) -> Tuple[bool, List[str]]:
    """
    Validate raw release data dict before DDEX generation.
    """
    errors: List[str] = []

    if not data.get("title"):
        errors.append("Release title is required")
    if not data.get("artist"):
        errors.append("Artist name is required")
    if not data.get("release_date"):
        errors.append("Release date is required")
    if not data.get("label_name"):
        errors.append("Label name is required")

    tracks = data.get("tracks", [])
    for i, track in enumerate(tracks):
        if not track.get("title"):
            errors.append(f"Track {i+1} is missing a title")
        if not track.get("isrc"):
            errors.append(f"Track {i+1} ({track.get('title', '?')}) is missing an ISRC")

    return len(errors) == 0, errors
