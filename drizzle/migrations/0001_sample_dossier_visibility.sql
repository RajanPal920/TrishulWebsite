CREATE POLICY "Authenticated buyers may view the sample dossier"
  ON public.client_orders FOR SELECT TO authenticated
  USING (lower(owner_email) = 'demo@trishulmetal.com');

CREATE POLICY "Authenticated buyers may view sample dossier lines"
  ON public.client_order_lines FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.client_orders o
    WHERE o.id = order_id AND lower(o.owner_email) = 'demo@trishulmetal.com'
  ));

CREATE POLICY "Authenticated buyers may view sample dossier documents"
  ON public.client_documents FOR SELECT TO authenticated
  USING (lower(owner_email) = 'demo@trishulmetal.com');