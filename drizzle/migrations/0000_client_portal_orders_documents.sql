-- Client portal: orders, order lines, dossier documents
CREATE TABLE public.client_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email text NOT NULL,
  po_number text NOT NULL,
  project_name text,
  status text NOT NULL DEFAULT 'in-production',
  incoterm text,
  destination_port text,
  carrier text,
  vessel text,
  container_no text,
  bl_number text,
  dispatched_on date,
  eta date,
  total_weight_kg numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  order_value numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_order_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.client_orders(id) ON DELETE CASCADE,
  description text NOT NULL,
  material_slug text,
  product_slug text,
  size text,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  heat_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email text NOT NULL,
  order_id uuid REFERENCES public.client_orders(id) ON DELETE CASCADE,
  doc_type text NOT NULL DEFAULT 'MTC',
  title text NOT NULL,
  reference text,
  issued_on date NOT NULL DEFAULT current_date,
  storage_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_orders TO authenticated;
GRANT SELECT ON public.client_order_lines TO authenticated;
GRANT SELECT ON public.client_documents TO authenticated;
GRANT ALL ON public.client_orders TO service_role;
GRANT ALL ON public.client_order_lines TO service_role;
GRANT ALL ON public.client_documents TO service_role;

ALTER TABLE public.client_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers read their own orders"
  ON public.client_orders FOR SELECT TO authenticated
  USING (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Buyers read lines of their own orders"
  ON public.client_order_lines FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.client_orders o
    WHERE o.id = order_id
      AND lower(o.owner_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  ));

CREATE POLICY "Buyers read their own documents"
  ON public.client_documents FOR SELECT TO authenticated
  USING (lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE INDEX client_orders_owner_idx ON public.client_orders (lower(owner_email));
CREATE INDEX client_documents_owner_idx ON public.client_documents (lower(owner_email));

-- Demo dossier data for the shared demo buyer account
INSERT INTO public.client_orders (id, owner_email, po_number, project_name, status, incoterm, destination_port, carrier, vessel, container_no, bl_number, dispatched_on, eta, total_weight_kg, currency, order_value) VALUES
 ('11111111-1111-4111-8111-111111111111','demo@trishulmetal.com','PO-EPC-4471','Offshore Riser Package — North Sea','in-transit','CIF','Rotterdam, NL','Maersk','MAERSK CHENNAI','MSKU4471820','BL-NHV-88213','2026-08-04','2026-09-02',4820,'USD',186400),
 ('22222222-2222-4222-8222-222222222222','demo@trishulmetal.com','PO-EPC-4390','Desalination Intake Header — Jubail','delivered','FOB','Dammam, SA','CMA CGM','CMA CGM JADE','CMAU2210394','BL-NHV-86011','2026-06-12','2026-07-01',9120,'USD',241900),
 ('33333333-3333-4333-8333-333333333333','demo@trishulmetal.com','PO-EPC-4512','Refinery Sour Service Revamp — Houston','in-production','DDP','Houston, US','Hapag-Lloyd',NULL,NULL,NULL,NULL,'2026-10-06',2650,'USD',132750);

INSERT INTO public.client_order_lines (order_id, description, material_slug, product_slug, size, quantity, unit, heat_ref) VALUES
 ('11111111-1111-4111-8111-111111111111','Weld Neck Flange, RTJ, Class 900','super-duplex-2507','weld-neck-flanges','NPS 6 SCH 80',48,'pcs','H-2507-4471A'),
 ('11111111-1111-4111-8111-111111111111','90° LR Elbow, buttweld','super-duplex-2507','90-degree-elbows','NPS 6 SCH 80',36,'pcs','H-2507-4471B'),
 ('22222222-2222-4222-8222-222222222222','Seamless Pipe, ASTM A790','duplex-2205','seamless-pipes','NPS 10 SCH 40S',620,'m','H-2205-4390A'),
 ('22222222-2222-4222-8222-222222222222','Blind Flange, RF, Class 300','duplex-2205','blind-flanges','NPS 10',24,'pcs','H-2205-4390C'),
 ('33333333-3333-4333-8333-333333333333','Socket Weld Tee, Class 3000','inconel-625','socket-weld-fittings','NPS 1',120,'pcs',NULL);

INSERT INTO public.client_documents (owner_email, order_id, doc_type, title, reference, issued_on) VALUES
 ('demo@trishulmetal.com','11111111-1111-4111-8111-111111111111','MTC','EN 10204 3.1 MTC — UNS S32750 Weld Neck Flanges','MTC/4471/A','2026-07-28'),
 ('demo@trishulmetal.com','11111111-1111-4111-8111-111111111111','TPI','TPI Release Note — Bureau Veritas','BV/RN/4471','2026-07-30'),
 ('demo@trishulmetal.com','11111111-1111-4111-8111-111111111111','Packing List','Packing List & Case Marking','PL/4471','2026-08-03'),
 ('demo@trishulmetal.com','22222222-2222-4222-8222-222222222222','MTC','EN 10204 3.1 MTC — UNS S31803 Seamless Pipe','MTC/4390/A','2026-06-05'),
 ('demo@trishulmetal.com','22222222-2222-4222-8222-222222222222','TPI','TPI Inspection Report — SGS','SGS/IR/4390','2026-06-09'),
 ('demo@trishulmetal.com','22222222-2222-4222-8222-222222222222','Certificate of Origin','Certificate of Origin — India','COO/4390','2026-06-11');