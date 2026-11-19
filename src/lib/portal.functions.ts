/**
 * Trishul Metals - Portal Data Functions
 * Customer portal queries are routed directly through /api/customer/* endpoints
 * with session authentication and SQLite database isolation.
 */

export interface PortalProfile {
  company: string;
  contact_name: string;
  phone: string | null;
  country: string | null;
  email?: string;
}

export interface ClientOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount?: number;
  currency?: string;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  document_type: string;
  storage_path: string;
  issued_on: string;
}

export interface RfqRequestRecord {
  id: string;
  reference: string;
  company: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  incoterm?: string | null;
  delivery_port?: string | null;
  target_lead_time?: string | null;
  project_name?: string | null;
  message?: string | null;
  items: any;
  attachments: any;
  testing?: any;
  certification?: string | null;
  status: string;
  created_at: string;
  confirmation_token: string;
}

export interface PortalData {
  email: string;
  profile: PortalProfile | null;
  orders: ClientOrder[];
  lines: any[];
  documents: ClientDocument[];
  rfqs: RfqRequestRecord[];
}
