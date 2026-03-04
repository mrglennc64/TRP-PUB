-- Shazam track metadata
CREATE TABLE IF NOT EXISTS shazam_tracks (
    id SERIAL PRIMARY KEY,
    isrc TEXT,
    track_id TEXT REFERENCES track_metadata(track_id),
    shazam_id TEXT UNIQUE,
    title TEXT,
    artist TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shazam_tracks_isrc ON shazam_tracks(isrc);
CREATE INDEX IF NOT EXISTS idx_shazam_tracks_track_id ON shazam_tracks(track_id);

-- Shazam daily counts (time series)
CREATE TABLE IF NOT EXISTS shazam_daily (
    id SERIAL PRIMARY KEY,
    shazam_id TEXT REFERENCES shazam_tracks(shazam_id),
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    rank INTEGER,
    region TEXT DEFAULT 'US',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(shazam_id, date, region)
);

CREATE INDEX IF NOT EXISTS idx_shazam_daily_date ON shazam_daily(date);
CREATE INDEX IF NOT EXISTS idx_shazam_daily_region ON shazam_daily(region);
CREATE INDEX IF NOT EXISTS idx_shazam_daily_shazam_id ON shazam_daily(shazam_id);

-- Shazam spikes (significant increases)
CREATE TABLE IF NOT EXISTS shazam_spikes (
    id SERIAL PRIMARY KEY,
    shazam_id TEXT REFERENCES shazam_tracks(shazam_id),
    spike_date DATE NOT NULL,
    previous_avg FLOAT,
    current_count INTEGER,
    spike_factor FLOAT,
    detected_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shazam_spikes_date ON shazam_spikes(spike_date);
