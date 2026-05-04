-- Portfolio Database Schema

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    img TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Personal Info Table
CREATE TABLE IF NOT EXISTS personal_info (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
