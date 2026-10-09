-- CivicPulse AI Database Schema
-- Compatible with PostgreSQL and Supabase
-- Based on Knox Drift Architecture Blueprint

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'citizen' CHECK (role IN ('citizen', 'official', 'field_engineer', 'admin')),
    phone VARCHAR(20),
    ward_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ISSUES TABLE
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    srn VARCHAR(50) UNIQUE NOT NULL, -- Service Request Number (e.g. CIVIC-W12-2026-9041)
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL, -- Pothole, Garbage Dump, Waterlogging, Streetlight, Damaged Manhole
    department VARCHAR(100) NOT NULL, -- PWD / Roads, Solid Waste Management, BWSSB / Drainage, Electricity
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    ward_number VARCHAR(50) DEFAULT 'Ward 12 - Central',
    severity INTEGER CHECK (severity >= 0 AND severity <= 100),
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Triaged', 'Assigned', 'In Progress', 'Resolved', 'Rejected')),
    upvotes INTEGER DEFAULT 1,
    sla_hours INTEGER DEFAULT 48,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. IMAGES TABLE
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    storage_link TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'initial' CHECK (image_type IN ('initial', 'resolution_proof')),
    detected_label VARCHAR(100),
    confidence_score DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PREDICTIONS TABLE (AI & Forecasting)
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    severity_in_24_hours INTEGER,
    severity_in_3_days INTEGER,
    severity_in_7_days INTEGER,
    priority VARCHAR(20) CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    rainfall_forecast_mm DECIMAL(6, 2) DEFAULT 0.0,
    traffic_density VARCHAR(50) DEFAULT 'Moderate',
    risk_summary TEXT,
    model_version VARCHAR(50) DEFAULT 'YOLOv8-Civic + XGBoost-v1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ACTIONS TABLE (Government Resolution & Work Orders)
CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    recommended_action TEXT NOT NULL,
    assigned_team VARCHAR(255),
    assigned_official_name VARCHAR(255),
    work_order_id VARCHAR(50),
    resolved_time TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON issues(ward_number);
CREATE INDEX IF NOT EXISTS idx_issues_srn ON issues(srn);
CREATE INDEX IF NOT EXISTS idx_predictions_priority ON predictions(priority);
