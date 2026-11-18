CREATE TABLE public.cad_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  part_code text NOT NULL,
  family text NOT NULL,
  standard text,
  size text,
  spec text,
  facing text,
  material text,
  format text NOT NULL,
  name text,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  user_agent text,
  referrer text
);

GRANT ALL ON public.cad_downloads TO service_role;
GRANT SELECT ON public.cad_downloads TO authenticated;

ALTER TABLE public.cad_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read CAD download leads"
ON public.cad_downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role));