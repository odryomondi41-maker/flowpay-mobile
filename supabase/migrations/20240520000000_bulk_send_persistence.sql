-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT UNIQUE,
  mpesa_id TEXT UNIQUE,
  balance NUMERIC(15, 2) DEFAULT 0.00,
  points INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  fee NUMERIC(15, 2) DEFAULT 0.00,
  type TEXT NOT NULL CHECK (type IN ('payment', 'payout', 'send', 'receive', 'bill', 'bulk_send')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'hold')),
  description TEXT,
  recipient_phone TEXT,
  recipient_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- Enable RLS for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create Bulk Transactions table (to group multiple sends)
CREATE TABLE IF NOT EXISTS public.bulk_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount NUMERIC(15, 2) NOT NULL,
  recipient_count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Bulk Transactions
ALTER TABLE public.bulk_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bulk transactions"
  ON public.bulk_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bulk transactions"
  ON public.bulk_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Link individual transactions to bulk transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS bulk_transaction_id UUID REFERENCES public.bulk_transactions(id);

-- Handle profile updates on user signup (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();