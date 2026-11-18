-- Quote requests and their attachments are written only by the trusted
-- server function (service_role), so remove public write access.

DROP POLICY IF EXISTS "Anyone can submit a quotation request" ON public.rfq_requests;

REVOKE INSERT ON public.rfq_requests FROM anon, authenticated;
GRANT ALL ON public.rfq_requests TO service_role;

DROP POLICY IF EXISTS "Anyone can upload RFQ attachments" ON storage.objects;
