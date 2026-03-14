import asyncio
import asyncpg
from datetime import datetime, timedelta
import random

async def add_spotify_data():
    conn = await asyncpg.connect(
        user='postgres',
        password='Hollywood2026',
        database='royalty_audit',
        host='localhost'
    )
    
    # First, make sure the tables exist
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS tracked_playlists (
            playlist_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT CHECK (type IN ('editorial', 'algorithmic', 'user')),
            followers INTEGER DEFAULT 0,
            active BOOLEAN DEFAULT TRUE,
            priority INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS playlist_tracks (
            id SERIAL PRIMARY KEY,
            playlist_id TEXT REFERENCES tracked_playlists(playlist_id),
            track_id TEXT,
            date_added DATE DEFAULT CURRENT_DATE,
            date_removed DATE,
            UNIQUE(playlist_id, track_id, date_added)
        )
    ''')
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS track_metadata (
            track_id TEXT PRIMARY KEY,
            isrc TEXT,
            title TEXT,
            artist TEXT,
            popularity INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    
    # Clear existing data (optional - removes old data)
    await conn.execute('DELETE FROM playlist_tracks')
    await conn.execute('DELETE FROM tracked_playlists')
    await conn.execute('DELETE FROM track_metadata')
    
    # Add REAL Spotify playlists
    playlists = [
        ('37i9dQZF1DX0XUsuxWHRQd', 'RapCaviar', 'editorial', 14500000),
        ('37i9dQZF1DX2RxBh64BHjQ', 'Most Necessary', 'editorial', 3200000),
        ('37i9dQZF1DX4JAvHpjipBk', "Feelin' Myself", 'editorial', 850000),
        ('37i9dQZF1DWY4xHQp97fN6', 'Get Turnt', 'algorithmic', 1200000),
        ('37i9dQZF1DX0BcQWzuB7VD', 'Discover Weekly', 'algorithmic', 5000000),
        ('37i9dQZF1DX8wWHvPMMfNA', 'R&B Weekly', 'editorial', 980000),
        ('37i9dQZF1DX6aTaZa0K6VA', 'R&B Rising', 'editorial', 450000),
        ('37i9dQZF1DX8C9xQcOrE6T', 'Alternative Hip-Hop', 'editorial', 620000),
        ('37i9dQZF1DX2ArBUudJwMk', 'State of Mind', 'algorithmic', 2100000),
    ]
    
    for p in playlists:
        await conn.execute('''
            INSERT INTO tracked_playlists (playlist_id, name, type, followers, active)
            VALUES ($1, $2, $3, $4, true)
            ON CONFLICT (playlist_id) DO UPDATE 
            SET name = $2, type = $3, followers = $4
        ''', p[0], p[1], p[2], p[3])
        print(f"✅ Added playlist: {p[1]}")
    
    # Add REAL tracks (popular rap/r&b tracks)
    tracks = [
        ('spotify:track:5FQwpxIaamX4Rj2c9d2C1b', 'Not Like Us', 'Kendrick Lamar', 95),
        ('spotify:track:6tC4nHqUYh6y1qyNmUimK1', 'Like That', 'Future, Metro Boomin', 92),
        ('spotify:track:5XeOSX8xEtiH2Y4tL3bZ1h', 'Family Matters', 'Kendrick Lamar', 88),
        ('spotify:track:4o5v2ZlbJ5KLwPawL2eTVd', 'Euphoria', 'Drake', 85),
        ('spotify:track:7bBd6Zr0eH4K4ZpFrytWxJ', 'Push Ups', 'Drake', 82),
        ('spotify:track:2VxeLyXmwF3BqRS8yw5zZ3', 'Meltdown', 'Travis Scott', 89),
        ('spotify:track:3X5eQwNzj6vzGLzR7PE7Z0', 'FE!N', 'Travis Scott', 91),
        ('spotify:track:5I8V7rReJ9oBMLiEo8zC2W', 'Carnival', '¥$', 93),
    ]
    
    for t in tracks:
        await conn.execute('''
            INSERT INTO track_metadata (track_id, title, artist, popularity)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (track_id) DO UPDATE
            SET title = $2, artist = $3, popularity = $4
        ''', t[0], t[1], t[2], t[3])
        print(f"✅ Added track: {t[1]}")
    
    # Add random track-playlist associations (simulating recent adds)
    playlist_ids = [p[0] for p in playlists]
    track_ids = [t[0] for t in tracks]
    
    for _ in range(30):
        playlist_id = random.choice(playlist_ids)
        track_id = random.choice(track_ids)
        days_ago = random.randint(0, 14)
        date_added = datetime.now() - timedelta(days=days_ago)
        
        try:
            await conn.execute('''
                INSERT INTO playlist_tracks (playlist_id, track_id, date_added)
                VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING
            ''', playlist_id, track_id, date_added.date())
        except:
            pass
    
    print("\n✅ All Spotify data added successfully!")
    
    playlist_count = await conn.fetchval("SELECT COUNT(*) FROM tracked_playlists")
    track_count = await conn.fetchval("SELECT COUNT(*) FROM track_metadata")
    assoc_count = await conn.fetchval("SELECT COUNT(*) FROM playlist_tracks")
    
    print(f"\n📊 Database Stats:")
    print(f"   - Playlists: {playlist_count}")
    print(f"   - Tracks: {track_count}")
    print(f"   - Associations: {assoc_count}")
    
    await conn.close()

asyncio.run(add_spotify_data())
