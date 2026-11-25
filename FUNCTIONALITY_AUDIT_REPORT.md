# FUNCTIONALITY AUDIT & SUBMISSION ERROR RESOLUTION REPORT

**Project:** Trishul Metals & Alloys (`E:\trishulmetal`)  
**Repository:** `https://github.com/RajanPal920/TrishulWebsite.git` (`main`)  
**Date:** November 25, 2026  
**Auditor:** Automated Engineering Subsystem  

---

## 1. Executive Summary

A comprehensive investigation and functional audit of the Trishul Metals & Alloys web platform was executed to resolve form submission failures, eliminate unhandled runtime exceptions in Express/Vite routing layers, preserve MySQL database integrity, and verify all core interactive workflows.

All submission errors have been **fully resolved and verified with live database insertion checks**. Every primary form across the application—including RFQ submissions, Contact inquiries, Vendor onboarding, Customer registration, Account profile updates, Portal requests, and CAD download leads—now functions reliably with instant loading states, duplicate prevention, and clean response confirmation.

---

## 2. Root Cause of the Submission Error

### Error Stack Reported:
```text
at file:///E:/trishulmetal/node_modules/.vite-temp/vite.config.ts.timestamp-...mjs:5202:4
at Layer.handleRequest (E:\trishulmetal\node_modules\router\lib\layer.js:169:33)
at next (E:\trishulmetal\node_modules\router\lib\route.js:163:13)
at Route.dispatch (E:\trishulmetal\node_modules\router\lib\route.js:123:3)
at handle (E:\trishulmetal\node_modules\router\index.js:449:11)
```

### Detailed Forensic Diagnosis:
1. **Missing Variable In Destructuring (`server/routes/public.js:85`)**:
   - In `router.post('/rfq')`, attachment size validation logic evaluated `(attachments || []).reduce(...)`.
   - However, `attachments` was **omitted from the `req.body` destructuring statement** at lines 63–75.
   - Any RFQ form submission immediately triggered `ReferenceError: attachments is not defined` at runtime.
   - The Express route caught this error and returned HTTP 500 (`Failed to submit RFQ request.`).
   - The frontend fallback invocation then triggered query execution against `rfq_requests` at line 5202 of the bundled Vite Express layer, resulting in the logged stack trace.

2. **MySQL Database Engine False Downgrade (`server/db/connection.js`)**:
   - In `connection.js`, any non-fatal SQL exception (e.g. `ER_DUP_FIELDNAME` during `ALTER TABLE` schema synchronizations on startup) was indiscriminately caught and executed `activeEngine = 'sqlite'`.
   - This caused MySQL to be permanently downgraded to SQLite for subsequent queries even when the MySQL database was 100% online and healthy.
   - Fixed by restricting SQLite fallback exclusively to fatal network/connectivity dropouts (`ECONNREFUSED`, `ETIMEDOUT`, `PROTOCOL_CONNECTION_LOST`, etc.), preserving MySQL as the primary engine.

3. **Missing Public Endpoints**:
   - `POST /api/contact` and `POST /api/enquiries` were missing in `server/routes/public.js`.
   - `POST /api/vendors` and `POST /api/vendor-registration` were missing in `server/routes/public.js`.
   - Added robust, validated endpoints that write records to MySQL `inquiries` and `vendor_registrations`, log activity history, and send export desk notifications.

---

## 3. Files Changed

| File Path | Description of Changes |
| :--- | :--- |
| `server/routes/public.js` | Fixed `attachments` destructuring in `POST /api/rfq`. Added `POST /api/contact`, `POST /api/enquiries`, `POST /api/vendors`, `POST /api/vendor-registration`, and `POST /api/boq/parse`. |
| `server/db/connection.js` | Added `isFatalConnectionError()` filter so only true connectivity failures trigger SQLite fallback; prevented benign schema errors from demoting MySQL engine. |
| `server/db/init.js` | Updated schema migrations to inspect column existence via `SHOW COLUMNS` before running `ALTER TABLE`, avoiding `ER_DUP_FIELDNAME`. Added `vendor_registrations` table schema. |
| `src/routes/contact.tsx` | Added interactive, validated Technical Desk Contact & Enquiry form with loading indicators, duplicate submit lock, and success alert banner. |
| `src/routes/vendor-registration.tsx` | Added Supplier & Mill Enrolment Application form with input validation, duplicate prevention, and direct integration with `/api/vendors`. |
| `package.json` | Updated dev script with `--max-old-space-size=4096` to prevent memory exhaustion during Vite dependency re-optimization. |

---

## 4. API Endpoints & Routes Fixed

| Endpoint | Method | Previous Status | Fixed Status | Database Target |
| :--- | :---: | :---: | :---: | :--- |
| `/api/rfq` | POST | 500 (ReferenceError) | **201 Created** | MySQL `rfq_requests` + `request_activity_history` |
| `/api/rfq/confirmation/:token` | GET | 500 / 404 | **200 OK** | MySQL `rfq_requests` |
| `/api/contact` | POST | 404 (Not Found) | **201 Created** | MySQL `inquiries` + `request_activity_history` |
| `/api/enquiries` | POST | 404 (Not Found) | **201 Created** | MySQL `inquiries` + `request_activity_history` |
| `/api/vendors` | POST | 404 (Not Found) | **201 Created** | MySQL `vendor_registrations` |
| `/api/vendor-registration` | POST | 404 (Not Found) | **201 Created** | MySQL `vendor_registrations` |
| `/api/boq/parse` | POST | Missing | **200 OK** | Server-side BOQ/MTO CSV parser |
| `/api/cad-download` | POST | 200 OK | **200 OK** | MySQL `cad_downloads` |
| `/api/auth/register` | POST | 201 Created | **201 Created** | MySQL `users` |
| `/api/auth/login` | POST | 200 OK | **200 OK** | MySQL `users` + `user_sessions` |
| `/api/customer/profile` | PUT | 200 OK | **200 OK** | MySQL `users` |
| `/api/customer/product-requests` | POST | 201 Created | **201 Created** | MySQL `product_requests` |
| `/api/customer/material-requests`| POST | 201 Created | **201 Created** | MySQL `material_requests` |
| `/api/customer/inquiries` | POST | 201 Created | **201 Created** | MySQL `inquiries` |
| `/api/auth/forgot-password` | POST | 200 OK | **200 OK** | MySQL `password_reset_tokens` |

---

## 5. Live Functional Form Tests & Evidence

Every submission was executed with realistic engineering test data against the live backend, and direct SQL assertions were executed to prove database persistence.

### Evidence of Database Insertion:
1. **RFQ Submission (`TM-RFQ-408520`)**:
   - `SELECT id, reference, email, company FROM rfq_requests WHERE reference = 'TM-RFQ-408520'`
   - **Result:** `id: 'b9f3052d-37b4-4e28-8cf4-bff87d80a562'`, `email: 'test-audit@trishulmetal.com'`, `company: 'Audit Engineering Pvt Ltd'`.
2. **Vendor Registration (`Test Mill India`)**:
   - `SELECT id, company_name, email FROM vendor_registrations WHERE email = 'vendor-test@trishulmetal.com'`
   - **Result:** `id: '5f57d2ef-f985-4cab-9427-905aa06e49ad'`, `company_name: 'Test Mill India'`.
3. **CAD Download Lead (`FLG-WN-INC625-2IN-CL300`)**:
   - `SELECT id, part_code, email FROM cad_downloads WHERE email = 'cad-test@trishulmetal.com'`
   - **Result:** `part_code: 'FLG-WN-INC625-2IN-CL300'`, `email: 'cad-test@trishulmetal.com'`.
4. **Customer Account (`test-user-1795611502284@trishulmetal.com`)**:
   - `SELECT id, email, full_name, company FROM users WHERE id = '7c9b6508-3b4f-4e48-b29c-01a6b968bb0c'`
   - **Result:** `full_name: 'Audit Registered User Updated'`, `company: 'Test Customer Works Ltd (Updated)'`.
5. **Customer Product Request (`Duplex 2205 Slip-On Flange`)**:
   - `SELECT id, product_name, quantity FROM product_requests WHERE id = '0d87ac88-d57d-4f3c-948f-efc948c87e61'`
   - **Result:** `product_name: 'Duplex 2205 Slip-On Flange'`, `quantity: '25 pcs'`.
6. **Customer Material Request (`Super Duplex 2507 Seamless Pipe`)**:
   - `SELECT id, material_name, quantity FROM material_requests WHERE id = '7f4da8c0-c057-4703-8fa2-d55af82424c8'`
   - **Result:** `material_name: 'Super Duplex 2507'`, `quantity: '150 meters'`.
7. **Customer Inquiry (`Inconel 625 MTC Query`)**:
   - `SELECT id, subject, message FROM inquiries WHERE id = '33abaf34-3085-4a37-94e8-c8b37cf549d7'`
   - **Result:** `subject: 'Inconel 625 MTC Query'`.
8. **Password Reset Token**:
   - `SELECT id, user_id, expires_at FROM password_reset_tokens WHERE user_id = '7c9b6508-3b4f-4e48-b29c-01a6b968bb0c'`
   - **Result:** Token hash generated and stored with 1-hour expiration.

---

## 6. Website Features Verified as Working (Regression Audit)

- **Homepage (`/`)**: Hero section, matrix counters, facility gallery, grade finder, trust points, and footer links render cleanly.
- **Catalogue & Products (`/products`, `/products/*`)**: All product lines, dimensional standards (ASME B16.5, B16.9), and interactive CAD links load properly.
- **Materials (`/materials`, `/materials/*`)**: Inconel, Monel, Hastelloy, Duplex, Super Duplex, and Stainless alloy profiles display specifications and ASTM grades.
- **Industries (`/industries`, `/industries/*`)**: All 26 industry sectors display specific piping metallurgy and supply scopes.
- **Interactive Tools**:
  - Landed Cost Calculator (`/landed-cost`): Section 232 tariff presets (25% steel, 10% aluminum), air/sea freight models, and PDF export function properly.
  - Grade Finder & Matrix (`/matrix`): Live filtering by UNS number, DIN, and alloy family.
  - CAD Viewer (`/cad`): Parametric 3D Three.js canvas and DXF/STL generation verified.
  - Live Stockyard (`/stock`): Real-time stock queries with ready/limited availability flags.
- **Authentication**:
  - Admin sign-in (`/admin`) and Customer sign-in (`/auth`) issue JWT session tokens.
  - Protected admin routes (`/admin`) and customer portal (`/portal`) load with role verification.
  - Reset password flow (`/reset-password`) validates tokens and updates bcrypt hashes.
- **SEO & Meta**: Complete JSON-LD schema (Organization, WebSite), OpenGraph tags, sitemap.xml, and llms.txt.

---

## 7. External Dependencies & Third-Party Requirements

| Service | Dependency | Status | Operational Note |
| :--- | :--- | :---: | :--- |
| **MySQL Engine** | Local / Cloud MySQL Server | **CONNECTED** | Primary engine active; SQLite fallback available for zero downtime. |
| **Hostinger SMTP** | `smtp.hostinger.com:465` (`notifications@trishulmetal.com`) | **CREDENTIAL MISMATCH** | The Hostinger mailbox returned `535 5.7.8 Authentication failed`. Forms succeed regardless because the email service operates asynchronously without blocking user response. To deliver actual outbound emails to inboxes, update `SMTP_PASS` in `.env` to match the current Hostinger Webmail mailbox password. |

---

## 8. Build & Runtime Test Results

- **Vite Development Server**: HTTP 200 OK on `http://localhost:8080/`.
- **Headless Chrome CDP UI Audit**: 24 routes evaluated via headless Chrome—0 hydration errors, 0 runtime exceptions.
- **Production Compilation (`npm run build`)**:
  - Client bundle: 2,816 modules transformed, 0 errors.
  - Server SSR bundle: Nitro Cloudflare/Node module built in 3.29s, 0 errors.
