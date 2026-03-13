#!/usr/bin/env python
import asyncio
import asyncpg
import os

async def create_tables():
    # Database connection string with encoded password
    DATABASE_URL = "postgresql://postgres:Hollywood2026@localhost:5432/royalty_audit"
    
    # Connect to the database
    conn = await asyncpg.connect(DATABASE_URL)
    
    try:
        # Create shazam_tracks table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS shazam_tracks (
                id SERIAL PRIMARY KEY,
                isrc TEXT,
                track_id TEXT,
                shazam_id TEXT UNIQUE,
                title TEXT,
                artist TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        # Create indexes
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_tracks_isrc ON shazam_tracks(isrc)')
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_tracks_track_id ON shazam_tracks(track_id)')
        
        # Create shazam_daily table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS shazam_daily (
                id SERIAL PRIMARY KEY,
                shazam_id TEXT,
                date DATE NOT NULL,
                count INTEGER DEFAULT 0,
                rank INTEGER,
                region TEXT DEFAULT 'US',
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(shazam_id, date, region)
            )
        ''')
        
        # Create indexes
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_daily_date ON shazam_daily(date)')
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_daily_region ON shazam_daily(region)')
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_daily_shazam_id ON shazam_daily(shazam_id)')
        
        # Create shazam_spikes table
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS shazam_spikes (
                id SERIAL PRIMARY KEY,
                shazam_id TEXT,
                spike_date DATE NOT NULL,
                previous_avg FLOAT,
                current_count INTEGER,
                spike_factor FLOAT,
                detected_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        # Create index
        await conn.execute('CREATE INDEX IF NOT EXISTS idx_shazam_spikes_date ON shazam_spikes(spike_date)')
        
        print("✅ Shazam tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(create_tables())
