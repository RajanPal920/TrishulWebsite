CREATE TABLE public.document_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  document_key text NOT NULL,
  document_title text,
  name text,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  user_agent text,
  referrer text
);

GRANT ALL ON public.document_downloads TO service_role;

ALTER TABLE public.document_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read download leads"
ON public.document_downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role));

GRANT SELECT ON public.document_downloads TO authenticated;