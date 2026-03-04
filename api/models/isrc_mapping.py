# /root/traproyalties-new/api/models/isrc_mapping.py

import os
from sqlalchemy import create_engine, Column, String, DateTime, Integer, Boolean, Text, Index, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database URL from environment - use 127.0.0.1 instead of localhost to force IPv4
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:Hollywood2026@127.0.0.1:5432/royalty_audit')

# Create PostgreSQL engine
try:
    engine = create_engine(DATABASE_URL, echo=False)
    logger.info("✅ PostgreSQL engine created successfully")
except Exception as e:
    logger.error(f"❌ Failed to create engine: {e}")
    raise

# Create declarative base
Base = declarative_base()

# Define the ISRC Mapping model
class ISRCMapping(Base):
    __tablename__ = 'isrc_mappings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    isrc = Column(String(20), nullable=False, index=True)
    track_title = Column(String(255), nullable=True)
    artist_name = Column(String(255), nullable=True)
    album_name = Column(String(255), nullable=True)
    work_id = Column(String(50), nullable=True, index=True)
    composers = Column(Text, nullable=True)  # JSON string of composers
    publishers = Column(Text, nullable=True)  # JSON string of publishers
    source = Column(String(50), nullable=True)  # 'musicbrainz', 'spotify', 'manual', etc.
    confidence = Column(Integer, default=0)  # 0-100 confidence score
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_isrc_source', 'isrc', 'source'),
        Index('idx_isrc_verified', 'isrc', 'verified'),
    )

# Define the ISRC Audit model for tracking audit history
class ISRCAudit(Base):
    __tablename__ = 'isrc_audits'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    isrc = Column(String(20), nullable=False, index=True)
    audit_type = Column(String(50), nullable=False)  # 'creation', 'verification', 'update', 'mismatch'
    old_data = Column(Text, nullable=True)  # JSON string of old data
    new_data = Column(Text, nullable=True)  # JSON string of new data
    notes = Column(Text, nullable=True)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Define the ISRC Mismatch model for tracking conflicts
class ISRCMismatch(Base):
    __tablename__ = 'isrc_mismatches'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    isrc = Column(String(20), nullable=False, index=True)
    source_a = Column(String(50), nullable=False)
    source_b = Column(String(50), nullable=False)
    data_a = Column(Text, nullable=True)  # JSON string of data from source A
    data_b = Column(Text, nullable=True)  # JSON string of data from source B
    resolved = Column(Boolean, default=False)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    __table_args__ = (
        Index('idx_isrc_sources', 'isrc', 'source_a', 'source_b'),
    )

# Create tables function
def init_isrc_mappings_db(db_url_or_engine=None):
    """Initialize the ISRC mappings database"""
    try:
        # If a string URL is passed, create engine from it
        if isinstance(db_url_or_engine, str):
            from sqlalchemy import create_engine, text
            # Force IPv4 by replacing localhost with 127.0.0.1
            db_url = db_url_or_engine.replace('localhost', '127.0.0.1')
            engine = create_engine(db_url, echo=False)
            logger.info(f"✅ Created engine from URL: {db_url}")
        elif db_url_or_engine is None:
            # Use the global engine
            engine = globals()['engine']
            logger.info("✅ Using global engine")
        else:
            engine = db_url_or_engine
            logger.info("✅ Using provided engine")
        
        # Test connection using raw SQLAlchemy text()
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            conn.commit()
            logger.info("✅ Database connection successful")
        
        # Create tables
        Base.metadata.create_all(engine)
        logger.info("✅ ISRC mapping tables created/verified")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
    
    return engine

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize on import - but don't fail if it errors
try:
    init_isrc_mappings_db()
except Exception as e:
    logger.error(f"Failed to initialize ISRC mappings on import: {e}")
    # Don't raise - let the app try again later

# For direct execution
if __name__ == "__main__":
    print("Initializing ISRC mappings database...")
    init_isrc_mappings_db()
    print("✅ Done!")
