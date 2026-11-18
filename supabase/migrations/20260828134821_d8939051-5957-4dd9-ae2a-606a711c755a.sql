CREATE TABLE public.rfq_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  incoterm TEXT,
  delivery_port TEXT,
  target_lead_time TEXT,
  project_name TEXT,
  message TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rfq_requests TO anon;
GRANT INSERT ON public.rfq_requests TO authenticated;
GRANT ALL ON public.rfq_requests TO service_role;

ALTER TABLE public.rfq_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quotation request"
  ON public.rfq_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can upload RFQ attachments"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'rfq-uploads');