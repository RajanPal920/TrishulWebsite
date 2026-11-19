# Trishul Metals & Alloys — Industrial Sourcing & Procurement Platform

Enterprise-grade industrial website and customer procurement platform for **Trishul Metals & Alloys** (Mumbai, India). Supplies Corrosion-Resistant Alloy (CRA) piping components, nickel alloys, super duplex, duplex, and stainless steel flanges, buttweld fittings, and cut-to-size process piping.

## Technology Stack

- **Frontend**: React 19, TypeScript, TanStack Start & Router, Tailwind CSS
- **Backend**: Node.js, Express 5, REST APIs
- **Database**: MySQL (`trishul_db`) with resilient connection pooling and SQLite local fallback
- **Authentication**: JWT session tokens with role-based access control (Customer Portal & Owner Admin Console)
- **Features**: Interactive CAD configurators, RFQ management, Customer 360 directory, Material database, Weight & Engineering calculation tools

## Getting Started

### Prerequisites

- Node.js >= 20
- MySQL server (default: `127.0.0.1:3306`, database: `trishul_db`)

### Installation & Development

```bash
# Install dependencies
npm install

# Initialize database schema
npm run db:init

# Start full-stack development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
