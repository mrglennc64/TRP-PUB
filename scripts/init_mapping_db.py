#!/usr/bin/env python3
"""
Initialize the ISRC mappings database
Run this once to create the database tables
"""
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    from api.models.isrc_mapping import init_isrc_mappings_db
    print("🚀 Initializing ISRC mappings database...")
    
    # Initialize the database
    engine = init_isrc_mappings_db()
    
    print("✅ Database initialized successfully!")
    print("📁 Database location: ./isrc_mappings.db")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the project root with the virtual environment activated")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error initializing database: {e}")
    sys.exit(1)
