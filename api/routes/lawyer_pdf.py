from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import boto3
import os
from datetime import datetime
from botocore.config import Config
import uuid

# Import your lawyer PDF generator
from api.utils.lawyer_pdf_generator import generate_lawyer_pdf

router = APIRouter(prefix="/api/lawyer-pdf", tags=["lawyer-pdf"])

# Debug: Print environment variable status
print("\n" + "="*50)
print("Lawyer PDF Route Initializing")
print("="*50)

idrive_key = os.getenv('IDRIVE_KEY')
idrive_secret = os.getenv('IDRIVE_SECRET')
idrive_endpoint = os.getenv('IDRIVE_ENDPOINT', 'https://s3.eu-central-2.idrivee2.com')
idrive_bucket = os.getenv('IDRIVE_PRIVATE_BUCKET', 'traproyalties-private')

print(f"IDRIVE_KEY present: {bool(idrive_key)}")
print(f"IDRIVE_SECRET present: {bool(idrive_secret)}")
print(f"IDRIVE_ENDPOINT: {idrive_endpoint}")
print(f"IDRIVE_PRIVATE_BUCKET: {idrive_bucket}")

if not idrive_key or not idrive_secret:
    print("WARNING: Missing IDrive credentials! PDF generation will fail.")
else:
    print("IDrive credentials found")

# Initialize IDrive e2 client
s3 = boto3.client(
    's3',
    endpoint_url=idrive_endpoint,
    aws_access_key_id=idrive_key,
    aws_secret_access_key=idrive_secret,
    config=Config(signature_version='s3v4')
)

PRIVATE_BUCKET = idrive_bucket
print("="*50 + "\n")

# Pydantic models for request validation
class Contributor(BaseModel):
    name: str
    role: str
    ipi: str
    share: float

class PDFGenerationRequest(BaseModel):
    track_id: str
    title: str
    artist: str
    isrc: Optional[str] = None
    contributors: List[Contributor]

@router.post("/generate")
async def generate_lawyer_pdf_endpoint(
    request: Request,
    pdf_request: PDFGenerationRequest
):
    """
    ACTUAL FASTAPI ENDPOINT - Receives request, generates PDF, uploads to IDrive
    """
    try:
        # Verify credentials are available
        if not idrive_key or not idrive_secret:
            raise HTTPException(
                status_code=500, 
                detail="Server configuration error: IDrive credentials not set"
            )
        
        # Get client IP address from request
        client_ip = request.client.host
        print(f"📥 Received PDF generation request from IP: {client_ip}")
        print(f"📦 Track: {pdf_request.title} by {pdf_request.artist}")
        print(f"👥 Contributors: {len(pdf_request.contributors)}")
        
        # Create audit info for PDF (IP, timestamp, user)
        audit_info = {
            "user_id": "attorney-001",  # TODO: Replace with actual user ID from session
            "user_name": "Leron Rogers",  # TODO: Replace with actual user name
            "ip_address": client_ip,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Prepare data for PDF generator
        pdf_data = {
            "title": pdf_request.title,
            "artist": pdf_request.artist,
            "isrc": pdf_request.isrc,
            "contributors": [c.dict() for c in pdf_request.contributors]
        }
        
        # STEP 1: Generate PDF with watermark and audit trail
        print("📄 Generating PDF with lawyer features...")
        pdf_content = generate_lawyer_pdf(pdf_data, audit_info)
        print(f"✅ PDF generated successfully ({len(pdf_content)} bytes)")
        
        # Create unique filename
        file_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"split_agreement_{pdf_request.track_id}_{timestamp}.pdf"
        s3_key = f"legal-docs/{file_id}/{filename}"
        
        # Prepare metadata for S3 (audit trail stored with file)
        metadata = {
            'track_id': pdf_request.track_id,
            'title': pdf_request.title,
            'artist': pdf_request.artist,
            'isrc': pdf_request.isrc or '',
            'generated_by': audit_info['user_name'],
            'generated_by_ip': audit_info['ip_address'],
            'generated_at': audit_info['timestamp'],
            'contributor_count': str(len(pdf_request.contributors)),
            'document_type': 'split_agreement',
            'watermark': 'CONFIDENTIAL',
            'version': '1.0'
        }
        
        # STEP 2: Upload to IDrive e2 with metadata
        print(f"📤 Uploading to IDrive: {s3_key}")
        try:
            s3.put_object(
                Bucket=PRIVATE_BUCKET,
                Key=s3_key,
                Body=pdf_content,
                ContentType='application/pdf',
                Metadata=metadata
            )
            print(f"✅ Upload successful")
        except Exception as upload_error:
            print(f"❌ Upload failed: {str(upload_error)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload to IDrive: {str(upload_error)}"
            )
        
        # STEP 3: Generate presigned URL (expires in 1 hour)
        print("🔗 Generating presigned URL (expires in 1 hour)")
        try:
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': PRIVATE_BUCKET,
                    'Key': s3_key
                },
                ExpiresIn=3600  # 1 hour
            )
        except Exception as url_error:
            print(f"❌ URL generation failed: {str(url_error)}")
            presigned_url = None
        
        # Return success with URL and metadata
        return {
            'success': True,
            'message': 'PDF generated successfully',
            'url': presigned_url,
            'expires_in': '1 hour',
            'file_id': file_id,
            's3_key': s3_key,
            'metadata': metadata,
            'audit': {
                'generated_at': audit_info['timestamp'],
                'generated_by': audit_info['user_name'],
                'ip_address': audit_info['ip_address']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error generating PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/document/{file_id}")
async def get_document(file_id: str):
    """
    Get a presigned URL for an existing document
    """
    try:
        print(f"📥 Retrieving document with file_id: {file_id}")
        
        # List objects with this file_id
        response = s3.list_objects_v2(
            Bucket=PRIVATE_BUCKET,
            Prefix=f"legal-docs/{file_id}/"
        )
        
        if 'Contents' not in response or len(response['Contents']) == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get the latest document
        latest = max(response['Contents'], key=lambda x: x['LastModified'])
        s3_key = latest['Key']
        print(f"✅ Found document: {s3_key}")
        
        # Get metadata
        head_response = s3.head_object(
            Bucket=PRIVATE_BUCKET,
            Key=s3_key
        )
        
        # Generate fresh presigned URL (expires in 1 hour)
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': PRIVATE_BUCKET,
                'Key': s3_key
            },
            ExpiresIn=3600
        )
        
        return {
            'success': True,
            'url': presigned_url,
            'expires_in': '1 hour',
            's3_key': s3_key,
            'metadata': head_response.get('Metadata', {})
        }
        
    except Exception as e:
        print(f"❌ Error retrieving document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metadata/{file_id}")
async def get_document_metadata(file_id: str):
    """
    Get metadata for a document (audit trail)
    """
    try:
        response = s3.list_objects_v2(
            Bucket=PRIVATE_BUCKET,
            Prefix=f"legal-docs/{file_id}/"
        )
        
        if 'Contents' not in response or len(response['Contents']) == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get the latest document
        latest = max(response['Contents'], key=lambda x: x['LastModified'])
        s3_key = latest['Key']
        
        # Get metadata
        head_response = s3.head_object(
            Bucket=PRIVATE_BUCKET,
            Key=s3_key
        )
        
        return {
            'success': True,
            'file_id': file_id,
            's3_key': s3_key,
            'metadata': head_response.get('Metadata', {}),
            'last_modified': head_response.get('LastModified').isoformat() if head_response.get('LastModified') else None,
            'size': head_response.get('ContentLength', 0)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
