-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create code_snippets table
CREATE TABLE IF NOT EXISTS public.code_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'article', 'course', 'documentation', 'other')),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON public.articles USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_code_snippets_author ON public.code_snippets(author_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_created ON public.code_snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_code_snippets_tags ON public.code_snippets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON public.code_snippets(language);

CREATE INDEX IF NOT EXISTS idx_learning_resources_author ON public.learning_resources(author_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created ON public.learning_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_resources_tags ON public.learning_resources USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON public.learning_resources(resource_type);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for articles
CREATE POLICY "Anyone can view articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own articles" ON public.articles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own articles" ON public.articles FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for code_snippets
CREATE POLICY "Anyone can view code snippets" ON public.code_snippets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create code snippets" ON public.code_snippets FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own code snippets" ON public.code_snippets FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own code snippets" ON public.code_snippets FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for learning_resources
CREATE POLICY "Anyone can view learning resources" ON public.learning_resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create learning resources" ON public.learning_resources FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own learning resources" ON public.learning_resources FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own learning resources" ON public.learning_resources FOR DELETE USING (auth.uid() = author_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_snippets_updated_at BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON public.learning_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
