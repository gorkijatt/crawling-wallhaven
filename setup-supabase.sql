-- Create the wallhaven_tags table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS wallhaven_tags (
    id BIGSERIAL PRIMARY KEY,
    tag_id TEXT UNIQUE NOT NULL,
    tag_name TEXT NOT NULL,
    tag_url TEXT,
    creator TEXT,
    creator_url TEXT,
    created_date TEXT,
    category TEXT,
    submissions TEXT,
    views TEXT,
    favorites TEXT,
    crawled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_number INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tag_id ON wallhaven_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_category ON wallhaven_tags(category);
CREATE INDEX IF NOT EXISTS idx_crawled_at ON wallhaven_tags(crawled_at);

-- Add comment to table
COMMENT ON TABLE wallhaven_tags IS 'Stores tags crawled from Wallhaven.cc';
