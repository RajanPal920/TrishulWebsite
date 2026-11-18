CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Customers create their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND lower(email) = lower(COALESCE(auth.jwt() ->> 'email', '')));

CREATE POLICY "Customers update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND lower(email) = lower(COALESCE(auth.jwt() ->> 'email', '')));

ALTER TABLE public.rfq_requests
  ADD COLUMN IF NOT EXISTS owner_id UUID,
  ADD COLUMN IF NOT EXISTS reference TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS testing JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certification TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS rfq_requests_reference_key
  ON public.rfq_requests(reference) WHERE reference IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS rfq_requests_confirmation_token_key
  ON public.rfq_requests(confirmation_token);
CREATE INDEX IF NOT EXISTS rfq_requests_owner_id_idx
  ON public.rfq_requests(owner_id);
CREATE INDEX IF NOT EXISTS rfq_requests_email_idx
  ON public.rfq_requests(lower(email));

GRANT SELECT ON public.rfq_requests TO authenticated;

CREATE POLICY "Customers read their owned RFQs"
  ON public.rfq_requests FOR SELECT TO authenticated
  USING (
    owner_id = auth.uid()
    OR lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );