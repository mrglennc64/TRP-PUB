from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.db import database

router = APIRouter(prefix="/api/label/branding", tags=["label"])

class BrandingUpdate(BaseModel):
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    custom_domain: Optional[str] = None
    custom_subdomain: Optional[str] = None

@router.get("/{label_id}")
async def get_branding(label_id: int):
    """Get label branding settings"""
    query = "SELECT * FROM label_branding WHERE label_id = :label_id"
    result = await database.fetch_one(query, {"label_id": label_id})
    
    if not result:
        # Return defaults if no branding set
        return {
            "label_id": label_id,
            "primary_color": "#4f46e5",
            "secondary_color": "#818cf8",
            "is_white_label": False
        }
    return result

@router.post("/{label_id}")
async def update_branding(label_id: int, branding: BrandingUpdate):
    """Update label branding"""
    # Check if exists
    exists = await database.fetch_one(
        "SELECT 1 FROM label_branding WHERE label_id = :label_id",
        {"label_id": label_id}
    )
    
    if exists:
        query = """
            UPDATE label_branding 
            SET logo_url = COALESCE(:logo_url, logo_url),
                primary_color = COALESCE(:primary_color, primary_color),
                secondary_color = COALESCE(:secondary_color, secondary_color),
                custom_domain = COALESCE(:custom_domain, custom_domain),
                custom_subdomain = COALESCE(:custom_subdomain, custom_subdomain),
                is_white_label = TRUE
            WHERE label_id = :label_id
            RETURNING *
        """
    else:
        query = """
            INSERT INTO label_branding 
            (label_id, logo_url, primary_color, secondary_color, custom_domain, custom_subdomain, is_white_label)
            VALUES (:label_id, :logo_url, :primary_color, :secondary_color, :custom_domain, :custom_subdomain, TRUE)
            RETURNING *
        """
    
    result = await database.fetch_one(query, {
        "label_id": label_id,
        "logo_url": branding.logo_url,
        "primary_color": branding.primary_color,
        "secondary_color": branding.secondary_color,
        "custom_domain": branding.custom_domain,
        "custom_subdomain": branding.custom_subdomain
    })
    
    return result
