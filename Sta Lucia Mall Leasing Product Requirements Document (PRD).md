# **Product Requirements Document (PRD)**

## **Product: Mall Leasing Management System (MLMS) — Philippines Edition**

### **1\) Summary**

MLMS is a centralized platform for Philippine mall operators to manage **spaces, tenants, leases, billing/collections, percentage rent (gross sales), and compliance** (BIR-ready documentation, withholding, VAT/non-VAT handling, official receipt tracking). It supports **multiple malls**, role-based workflows, and audit-ready reporting.

### **2\) Goals**

* Increase leasing operational efficiency (less Excel/email dependency)

* Reduce revenue leakage (missed escalations, incorrect CAM/utility charges)

* Improve occupancy and renewal performance

* Provide finance-ready outputs (statements, aging, collections, audit logs)

* Support PH-specific operations: **VAT vs Non-VAT tenants, EWT/WHT handling, BIR invoicing references, OR/SI tracking, sales reporting for % rent**

### **3\) Non-Goals (Phase 1\)**

* Full ERP replacement (we integrate with accounting)

* Full POS integration for every tenant (we support sales submission \+ optional integrations)

* Complex CAD floor plan editor (basic unit mapping \+ optional image overlay)

### **4\) Personas & Roles**

* **Admin**: system setup, roles, mall/unit master data

* **Leasing Manager**: leads, offers, lease creation/renewals

* **Property Manager / Ops**: unit status, fit-out, compliance

* **Finance / Accounting**: invoicing, collections, penalties, OR/SI, reconciliations

* **Tenant User**: view invoices, submit sales, download statements, raise tickets

* **Auditor/Executive Viewer**: read-only dashboards & logs

### **5\) Core Objects (Domain Model)**

Mall → Building/Wing → Floor → Unit/Space → Lease → Charges → Invoices → Payments → Ledger/AR → Tenant Sales (for % rent)

### **6\) Functional Requirements**

#### **6.1 Mall & Space Inventory**

* Create malls, buildings/wings, floors, units

* Unit attributes: code, sqm, category (inline/kiosk/anchor/pop-up), zone, frontage, status

* Unit lifecycle: available → reserved → leased → renovation/blocked

* Attach unit photos/docs, optional map overlay

**Acceptance Criteria**

* Units can’t be double-leased for overlapping dates

* Unit status updates automatically from lease lifecycle

---

#### **6.2 Tenant Management (PH-specific fields)**

* Tenant company master:

  * Business name, trade name/brand(s)

  * Contact persons

  * Tax profile: VAT-registered? Withholding applicable? (configurable)

  * TIN (optional masking rules), billing address

  * Required documents tracking (BIR/permits/insurance/DTI/SEC, etc.)

**Acceptance Criteria**

* Tenant tax profile drives invoice tax calculations (via rules engine)

---

#### **6.3 Leasing & Contract Lifecycle**

* Lease types: fixed rent, fixed+CAM, % rent, pop-up short-term

* Terms:

  * start/end, rent frequency, grace period, escalation schedule

  * deposit(s): security deposit, advance rent, utilities deposit

  * free rent / concessions

* Amendments: rate change, unit change, term extension

* Renewal pipeline: alerts, negotiation notes, approval workflow

**Acceptance Criteria**

* Escalations apply automatically on scheduled effective dates

* Lease amendments are versioned and auditable

---

#### **6.4 Charge Engine (Rent \+ CAM \+ Utilities \+ Marketing Fund \+ Other)**

* Charge definitions per lease:

  * base rent (fixed or per sqm)

  * CAM (common area maintenance)

  * marketing fund

  * utilities (meter-based or fixed)

  * other recurring/one-time charges

* Fees:

  * late fee (flat or %)

  * interest / penalty rules

* Configurable PH tax rules:

  * VAT, withholding, exemptions, tenant-specific treatments

**Acceptance Criteria**

* Invoice line items are reproducible from charge rules (no “mystery math”)

---

#### **6.5 Invoicing, Collections, OR/SI Tracking (Finance)**

* Invoice generation (monthly/quarterly)

* Invoice states: draft → issued → partially paid → paid → void

* Track official receipt / sales invoice references:

  * OR number, SI number, issue date, attachments (PDF scans)

* Aging report (0–30, 31–60, 61–90, 90+)

* Statements of account per tenant/lease/unit

**Acceptance Criteria**

* Every issued invoice has immutable totals; corrections use credit/debit memo

---

#### **6.6 Percentage Rent & Tenant Gross Sales**

* Tenant portal for monthly sales submission

* Support audit flags: missing sales, suspicious drops/spikes

* % rent calculation:

  * based on gross sales and agreed %

  * with minimum rent logic (if applicable)

* Reconciliation invoice for % rent difference

**Acceptance Criteria**

* Sales submission has approvals \+ audit log \+ attachment support

---

#### **6.7 Workflows & Approvals**

* Approval flows for:

  * new lease creation

  * discounts/concessions

  * penalty waivers

  * renewals

* Notifications: email \+ in-app; optional SMS/Teams integrations

**Acceptance Criteria**

* Role-based approvals enforced; all actions logged

---

#### **6.8 Reporting & Dashboards**

* Occupancy by mall/floor/zone

* Revenue per sqm, tenant category mix

* Lease expiry heatmap (next 30/60/90/180 days)

* Collections dashboard: AR aging, top delinquents

* % rent performance: sales trends, % rent contributions

**Acceptance Criteria**

* Dashboards filter by mall, date range, unit type, tenant category

---

### **7\) Non-Functional Requirements**

* **Security:** RBAC, audit logs, encryption at rest for sensitive fields (TIN), MFA optional

* **Performance:** handle 10k+ invoices/month across multiple malls

* **Reliability:** daily backups, point-in-time recovery (Postgres)

* **Compliance:** immutable audit trails for finance-critical events

* **Integration-ready:** accounting export (CSV/API), payment gateways (optional)

---

### **8\) MVP Scope (Recommended)**

**MVP (8–12 weeks):**

* Mall/units, tenants, leases (fixed rent \+ basic escalations)

* Invoice generation \+ payments \+ AR aging

* Basic dashboards \+ exports

**Phase 2:**

* % rent \+ tenant portal sales submission

* OR/SI tracking \+ credit/debit memo

* Approval workflows \+ document compliance module

**Phase 3:**

* Integrations (accounting, payment gateway, POS)

* Advanced analytics \+ forecasting

---

# **Database Schema (PostgreSQL-Oriented)**

## **Key Design Principles**

* **Multi-mall** by default

* **Lease versioning** via amendments

* **Charges are rules**, invoices are snapshots

* **Audit trails** on finance and contract events

---

## **ERD Overview (High Level)**

* malls → buildings → floors → units

* tenants ↔ leases (leases link tenant \+ unit \+ terms)

* leases → lease\_charges (recurring/one-time rules)

* invoices → invoice\_lines (snapshotted from charges)

* payments → payment\_allocations (how payment applied)

* % rent: tenant\_sales\_reports → tenant\_sales\_lines (optional) → generates invoice lines

## **Core Tables (DDL Sketch)**

\-- 1\) Master Data  
CREATE TABLE malls (  
  id UUID PRIMARY KEY,  
  name TEXT NOT NULL,  
  legal\_entity\_name TEXT,  
  address TEXT,  
  timezone TEXT DEFAULT 'Asia/Manila',  
  currency TEXT DEFAULT 'PHP',  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE TABLE buildings (  
  id UUID PRIMARY KEY,  
  mall\_id UUID NOT NULL REFERENCES malls(id),  
  name TEXT NOT NULL  
);

CREATE TABLE floors (  
  id UUID PRIMARY KEY,  
  building\_id UUID NOT NULL REFERENCES buildings(id),  
  name TEXT NOT NULL,  
  level\_no INT  
);

CREATE TABLE units (  
  id UUID PRIMARY KEY,  
  floor\_id UUID NOT NULL REFERENCES floors(id),  
  unit\_code TEXT NOT NULL,  
  unit\_type TEXT NOT NULL,         \-- inline, kiosk, anchor, pop-up  
  zone TEXT,  
  area\_sqm NUMERIC(12,2) NOT NULL,  
  status TEXT NOT NULL,            \-- available, reserved, leased, blocked, renovation  
  metadata JSONB DEFAULT '{}'::jsonb,  
  UNIQUE(floor\_id, unit\_code)  
);

\-- 2\) Tenant Master (PH-focused fields)  
CREATE TABLE tenants (  
  id UUID PRIMARY KEY,  
  tenant\_name TEXT NOT NULL,  
  trade\_name TEXT,  
  tin\_encrypted TEXT,              \-- encrypted at app layer or via pgcrypto  
  vat\_profile TEXT NOT NULL,        \-- VAT\_REGISTERED / NON\_VAT / EXEMPT (configurable)  
  withholding\_profile TEXT,         \-- e.g., NONE / EWT\_APPLICABLE (configurable)  
  billing\_address TEXT,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE TABLE tenant\_contacts (  
  id UUID PRIMARY KEY,  
  tenant\_id UUID NOT NULL REFERENCES tenants(id),  
  name TEXT NOT NULL,  
  email TEXT,  
  phone TEXT,  
  role TEXT  
);

\-- 3\) Leasing  
CREATE TABLE leases (  
  id UUID PRIMARY KEY,  
  mall\_id UUID NOT NULL REFERENCES malls(id),  
  tenant\_id UUID NOT NULL REFERENCES tenants(id),  
  unit\_id UUID NOT NULL REFERENCES units(id),  
  lease\_no TEXT,  
  status TEXT NOT NULL,            \-- draft, active, expired, terminated  
  start\_date DATE NOT NULL,  
  end\_date DATE NOT NULL,  
  billing\_frequency TEXT NOT NULL, \-- monthly, quarterly  
  escalation\_policy JSONB DEFAULT '{}'::jsonb,  
  deposit\_policy JSONB DEFAULT '{}'::jsonb,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

\-- Lease amendments (versioning)  
CREATE TABLE lease\_amendments (  
  id UUID PRIMARY KEY,  
  lease\_id UUID NOT NULL REFERENCES leases(id),  
  amendment\_no TEXT,  
  effective\_date DATE NOT NULL,  
  changes JSONB NOT NULL,          \-- what changed (rates, dates, unit, etc.)  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

\-- 4\) Charge Rules (recurring/one-time)  
CREATE TABLE lease\_charges (  
  id UUID PRIMARY KEY,  
  lease\_id UUID NOT NULL REFERENCES leases(id),  
  charge\_type TEXT NOT NULL,       \-- BASE\_RENT, CAM, UTILITIES, MARKETING\_FUND, OTHER  
  calc\_method TEXT NOT NULL,        \-- FIXED, PER\_SQM, METERED, PERCENT\_SALES  
  amount NUMERIC(14,2),  
  rate NUMERIC(10,4),  
  start\_date DATE NOT NULL,  
  end\_date DATE,  
  tax\_rule\_id UUID,                \-- link to tax rules  
  metadata JSONB DEFAULT '{}'::jsonb  
);

\-- Configurable tax rules (PH: VAT/WHT handling)  
CREATE TABLE tax\_rules (  
  id UUID PRIMARY KEY,  
  name TEXT NOT NULL,  
  rule JSONB NOT NULL              \-- e.g. VAT applies? withholding applies? rounding? exemptions?  
);

\-- 5\) Invoicing (Snapshots)  
CREATE TABLE invoices (  
  id UUID PRIMARY KEY,  
  mall\_id UUID NOT NULL REFERENCES malls(id),  
  tenant\_id UUID NOT NULL REFERENCES tenants(id),  
  lease\_id UUID REFERENCES leases(id),  
  invoice\_no TEXT NOT NULL,  
  period\_start DATE NOT NULL,  
  period\_end DATE NOT NULL,  
  issue\_date DATE NOT NULL,  
  due\_date DATE NOT NULL,  
  status TEXT NOT NULL,            \-- draft, issued, partially\_paid, paid, void  
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,  
  tax\_total NUMERIC(14,2) NOT NULL DEFAULT 0,  
  withholding\_total NUMERIC(14,2) NOT NULL DEFAULT 0,  
  total\_due NUMERIC(14,2) NOT NULL DEFAULT 0,  
  official\_ref JSONB DEFAULT '{}'::jsonb, \-- OR/SI tracking refs, attachments pointers  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  UNIQUE(mall\_id, invoice\_no)  
);

CREATE TABLE invoice\_lines (  
  id UUID PRIMARY KEY,  
  invoice\_id UUID NOT NULL REFERENCES invoices(id),  
  lease\_charge\_id UUID REFERENCES lease\_charges(id),  
  description TEXT NOT NULL,  
  qty NUMERIC(14,4) NOT NULL DEFAULT 1,  
  unit\_price NUMERIC(14,2) NOT NULL DEFAULT 0,  
  line\_subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,  
  line\_tax NUMERIC(14,2) NOT NULL DEFAULT 0,  
  line\_withholding NUMERIC(14,2) NOT NULL DEFAULT 0,  
  line\_total NUMERIC(14,2) NOT NULL DEFAULT 0,  
  metadata JSONB DEFAULT '{}'::jsonb  
);

\-- Credit/Debit memos (PH practice for adjustments)  
CREATE TABLE adjustments (  
  id UUID PRIMARY KEY,  
  invoice\_id UUID NOT NULL REFERENCES invoices(id),  
  type TEXT NOT NULL,              \-- CREDIT / DEBIT  
  reason TEXT,  
  amount NUMERIC(14,2) NOT NULL,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

\-- 6\) Payments & Allocations  
CREATE TABLE payments (  
  id UUID PRIMARY KEY,  
  mall\_id UUID NOT NULL REFERENCES malls(id),  
  tenant\_id UUID NOT NULL REFERENCES tenants(id),  
  payment\_date DATE NOT NULL,  
  amount NUMERIC(14,2) NOT NULL,  
  method TEXT,                     \-- cash, bank\_transfer, gcash, check, etc.  
  reference\_no TEXT,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

CREATE TABLE payment\_allocations (  
  id UUID PRIMARY KEY,  
  payment\_id UUID NOT NULL REFERENCES payments(id),  
  invoice\_id UUID NOT NULL REFERENCES invoices(id),  
  allocated\_amount NUMERIC(14,2) NOT NULL  
);

\-- 7\) Percentage Rent Sales Reporting  
CREATE TABLE tenant\_sales\_reports (  
  id UUID PRIMARY KEY,  
  tenant\_id UUID NOT NULL REFERENCES tenants(id),  
  lease\_id UUID NOT NULL REFERENCES leases(id),  
  period\_start DATE NOT NULL,  
  period\_end DATE NOT NULL,  
  status TEXT NOT NULL,            \-- submitted, approved, rejected  
  gross\_sales NUMERIC(14,2) NOT NULL,  
  attachments JSONB DEFAULT '\[\]'::jsonb,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

\-- 8\) Audit Logs (critical for PH finance \+ approvals)  
CREATE TABLE audit\_logs (  
  id UUID PRIMARY KEY,  
  actor\_user\_id UUID,  
  action TEXT NOT NULL,  
  entity\_type TEXT NOT NULL,  
  entity\_id UUID NOT NULL,  
  before\_state JSONB,  
  after\_state JSONB,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  
);

# **Philippines-Specific Tailoring Notes (Built Into Requirements)**

* **VAT / Non-VAT tenant profiles** (configurable tax rules per tenant \+ per charge)

* **Withholding/EWT handling** as a structured rule (not hard-coded)

* **OR/SI tracking**: store OR/SI numbers, dates, attachments, and link to invoice

* **Percentage rent common in PH malls**: monthly gross sales submission \+ audit

* **Multi-mall legal entity support**: important if operator has multiple mall corporations

* **Collections reality**: partial payments, allocations, penalty rules, aging reports

API ENDPOINT LIST (Engineering Kickoff)

Conventions
	•	Base URL: /api/v1
	•	Auth: JWT / OAuth2
	•	RBAC enforced server-side

1. Authentication & Users

POST   /auth/login
POST   /auth/refresh
POST   /users
GET    /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}

2. Mall & Space Management

POST   /malls
GET    /malls
GET    /malls/{id}
PUT    /malls/{id}

POST   /buildings
GET    /buildings?mall_id=

POST   /floors
GET    /floors?building_id=

POST   /units
GET    /units?floor_id=
GET    /units/{id}
PUT    /units/{id}

3. Tenant Management
POST   /tenants
GET    /tenants
GET    /tenants/{id}
PUT    /tenants/{id}

POST   /tenants/{id}/contacts
GET    /tenants/{id}/contacts

4. Lease Management
POST   /leases
GET    /leases
GET    /leases/{id}
PUT    /leases/{id}
POST   /leases/{id}/activate
POST   /leases/{id}/terminate

POST   /leases/{id}/amendments
GET    /leases/{id}/amendments

5. Charges & Tax Rules

POST   /tax-rules
GET    /tax-rules

POST   /leases/{id}/charges
GET    /leases/{id}/charges
PUT    /lease-charges/{id}

6. Invoicing
POST   /invoices/generate
GET    /invoices
GET    /invoices/{id}
POST   /invoices/{id}/issue
POST   /invoices/{id}/void

POST   /invoices/{id}/adjustments

7. Payments & Collections
POST   /payments
GET    /payments
GET    /payments/{id}

POST   /payments/{id}/allocate
GET    /ar/aging

8. Percentage Rent & Sales
POST   /sales-reports
GET    /sales-reports?lease_id=
POST   /sales-reports/{id}/approve
POST   /sales-reports/{id}/reject

9. Reporting & Dashboards
GET /reports/occupancy
GET /reports/revenue
GET /reports/lease-expiry
GET /reports/ar-aging

10. Audit & System
GET /audit-logs
GET /health