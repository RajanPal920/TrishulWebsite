DROP POLICY IF EXISTS "Authenticated buyers may view the sample dossier" ON public.client_orders;
DROP POLICY IF EXISTS "Authenticated buyers may view sample dossier lines" ON public.client_order_lines;
DROP POLICY IF EXISTS "Authenticated buyers may view sample dossier documents" ON public.client_documents;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read their own roles" ON public.user_roles;
CREATE POLICY "Users read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT SELECT ON public.rfq_requests TO authenticated;

DROP POLICY IF EXISTS "Staff read RFQ submissions" ON public.rfq_requests;
CREATE POLICY "Staff read RFQ submissions"
ON public.rfq_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "Staff read rfq uploads" ON storage.objects;
CREATE POLICY "Staff read rfq uploads"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'rfq-uploads'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);

DROP POLICY IF EXISTS "Staff manage rfq uploads" ON storage.objects;
CREATE POLICY "Staff manage rfq uploads"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'rfq-uploads'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'rfq-uploads'
  AND public.has_role(auth.uid(), 'admin')
);
