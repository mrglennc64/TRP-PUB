from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import boto3
import os
from botocore.config import Config
from datetime import datetime

from ..utils.pdf_generator import generate_and_upload_pdf

router = APIRouter(prefix="/api/pdf", tags=["pdf"])

# Initialize S3 client for IDrive
s3 = boto3.client(
    's3',
    endpoint_url=os.getenv('IDRIVE_ENDPOINT', 'https://s3.eu-central-2.idrivee2.com'),
    aws_access_key_id=os.getenv('IDRIVE_KEY'),
    aws_secret_access_key=os.getenv('IDRIVE_SECRET'),
    config=Config(signature_version='s3v4')
)

PRIVATE_BUCKET = os.getenv('IDRIVE_PRIVATE_BUCKET', 'traproyalties-private')

class Participant(BaseModel):
    name: str
    role: str
    email: str
    percentage: float
    ipi: Optional[str] = None

class TrackData(BaseModel):
    title: str
    artist: str
    isrc: Optional[str] = None
    upload_date: Optional[str] = None

class PDFGenerationRequest(BaseModel):
    track_data: TrackData
    participants: List[Participant]
    agreement_id: str

@router.post("/generate-split-agreement")
async def generate_split_agreement(request: PDFGenerationRequest):
    """
    Generate a PDF split agreement and upload to IDrive e2
    """
    try:
        result = await generate_and_upload_pdf(
            track_data=request.track_data.dict(),
            participants=[p.dict() for p in request.participants],
            agreement_id=request.agreement_id,
            s3_client=s3,
            bucket_name=PRIVATE_BUCKET
        )
        
        if result['success']:
            return {
                'success': True,
                'message': 'PDF generated and uploaded successfully',
                'url': result['url'],
                's3_key': result['s3_key'],
                'filename': result['filename']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-contract/{agreement_id}")
async def get_contract(agreement_id: str, filename: Optional[str] = None):
    """
    Get a presigned URL for a contract
    """
    try:
        # If filename not provided, list objects to find latest
        if not filename:
            response = s3.list_objects_v2(
                Bucket=PRIVATE_BUCKET,
                Prefix=f"contracts/{agreement_id}/"
            )
            
            if 'Contents' not in response or len(response['Contents']) == 0:
                raise HTTPException(status_code=404, detail="Contract not found")
            
            # Get the most recent contract
            latest = max(response['Contents'], key=lambda x: x['LastModified'])
            key = latest['Key']
        else:
            key = f"contracts/{agreement_id}/{filename}"
        
        # Generate presigned URL (valid for 10 minutes - secure sharing)
        url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': PRIVATE_BUCKET,
                'Key': key
            },
            ExpiresIn=600  # 10 minutes
        )
        
        return {
            'success': True,
            'url': url,
            'expires_in': '10 minutes',
            's3_key': key
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
