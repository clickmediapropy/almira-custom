-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'scheduled', 'visited', 'converted', 'lost');
CREATE TYPE lead_source AS ENUM ('facebook', 'instagram', 'google', 'referral', 'direct', 'other');
CREATE TYPE document_category AS ENUM ('project', 'faq', 'pricing', 'policy', 'process');
CREATE TYPE project_type AS ENUM ('surubi', 'altavilla', 'alzara');

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  project_interest TEXT,
  source lead_source DEFAULT 'facebook',
  status lead_status DEFAULT 'new',
  hubspot_id TEXT UNIQUE,
  assigned_to TEXT,
  follow_up_count INTEGER DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge documents table
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category document_category NOT NULL,
  project_id project_type,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector embeddings for semantic search
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),
  tokens INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, chunk_index)
);

-- Conversation context for maintaining chat history
CREATE TABLE conversation_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  messages JSONB[] DEFAULT ARRAY[]::JSONB[],
  summary TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  calendly_event_id TEXT UNIQUE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  project project_type NOT NULL,
  showroom TEXT NOT NULL,
  assigned_agent TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages log
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  channel TEXT DEFAULT 'whatsapp',
  content TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead metrics for analytics
CREATE TABLE lead_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_leads INTEGER DEFAULT 0,
  contacted INTEGER DEFAULT 0,
  scheduled INTEGER DEFAULT 0,
  visited INTEGER DEFAULT 0,
  converted INTEGER DEFAULT 0,
  avg_response_time_seconds FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- Create indexes for performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_hubspot ON leads(hubspot_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

CREATE INDEX idx_documents_category ON knowledge_documents(category);
CREATE INDEX idx_documents_project ON knowledge_documents(project_id);
CREATE INDEX idx_documents_active ON knowledge_documents(is_active);

CREATE INDEX idx_embeddings_vector ON knowledge_embeddings
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_context_phone ON conversation_context(phone_number);
CREATE INDEX idx_context_lead ON conversation_context(lead_id);

CREATE INDEX idx_messages_lead ON messages(lead_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_for);

-- Function for semantic search
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  project_filter project_type DEFAULT NULL
)
RETURNS TABLE (
  chunk_text TEXT,
  similarity FLOAT,
  metadata JSONB,
  document_title TEXT,
  project_id project_type
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ke.chunk_text,
    1 - (ke.embedding <=> query_embedding) as similarity,
    ke.metadata,
    kd.title,
    kd.project_id
  FROM knowledge_embeddings ke
  JOIN knowledge_documents kd ON ke.document_id = kd.id
  WHERE
    kd.is_active = true
    AND (project_filter IS NULL OR kd.project_id = project_filter)
    AND 1 - (ke.embedding <=> query_embedding) > match_threshold
  ORDER BY ke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON knowledge_documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth strategy)
CREATE POLICY "Enable all operations for authenticated users" ON leads
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable read for all authenticated users" ON knowledge_documents
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable all operations for service role" ON knowledge_embeddings
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON conversation_context
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON appointments
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON messages
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable read for all authenticated users" ON lead_metrics
FOR SELECT TO authenticated USING (true);