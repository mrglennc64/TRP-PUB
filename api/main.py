from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from api.routes.upload import router as upload_router
from api.routes.digital_handshake import router as digital_handshake_router
from api.routes.splits import router as splits_router
from api.routes.attorney import router as attorney_router
from api.routes.pdf_generation import router as pdf_router
from api.routes.lawyer_pdf import router as lawyer_pdf_router
from api.routes.royalty_finder import router as royalty_finder_router
from api.routes.label_branding import router as label_branding_router
from api.routes.label_contracts import router as label_contracts_router
from api.routes.label_payouts import router as label_payouts_router
from api.routes.ddex import router as ddex_router

app = FastAPI(
    title="TrapRoyaltiesPro API",
    description="Music royalty tracking and verification system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(upload_router)
app.include_router(digital_handshake_router)
app.include_router(splits_router)
app.include_router(attorney_router)
app.include_router(pdf_router)
app.include_router(lawyer_pdf_router)
app.include_router(royalty_finder_router)
app.include_router(label_branding_router)
app.include_router(label_contracts_router)
app.include_router(label_payouts_router)
app.include_router(ddex_router)

@app.get("/")
async def root():
    return {
        "message": "TrapRoyaltiesPro API",
        "version": "1.0.0",
        "endpoints": [
            "/api/catalog/upload",
            "/api/catalog/tracks",
            "/api/digital-handshake/verify",
            "/api/splits/create",
            "/api/splits/verify",
            "/api/splits/track/{track_id}",
            "/api/splits/verify-page/{track_id}",
            "/api/pdf/generate-split-agreement",
            "/api/pdf/get-contract/{agreement_id}",
            "/api/lawyer-pdf/generate",
            "/api/lawyer-pdf/document/{file_id}",
            "/api/lawyer-pdf/metadata/{file_id}",
            "/api/ddex/generate",
            "/api/ddex/validate",
            "/api/ddex/import-dsr",
            "/api/ddex/releases",
            "/api/ddex/deliveries",
            "/health"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
