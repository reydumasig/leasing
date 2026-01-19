# MLMS Implementation Plan - Phased Approach

## Technology Stack (Confirmed)

- **Backend**: Node.js/Express (TypeScript)
- **Frontend**: React/Next.js (TypeScript)
- **Database (Local/Staging)**: Supabase (PostgreSQL)
- **Database (Production)**: Google Cloud SQL (PostgreSQL) - later
- **Authentication**: jsonwebtoken, bcrypt
- **Auth Strategy**: JWT + HTTP-only cookies + refresh token rotation
- **File Storage**: Google Cloud Storage (production), Supabase Storage (local/staging)
- **Database Migrations**: node-pg-migrate
- **Project Structure**: Separate backend/frontend repos
- **Staging**: Vercel + Supabase
- **Production**: Google Cloud (later)
- **Development**: Run locally for demos

## Business Context (Confirmed)

- **First Mall**: Mall Alpha
- **Existing Data**: None (greenfield)
- **MVP Target**: March 2026
- **Timeline**: ~6-7 weeks (Jan 14, 2026 → March 2026)
- **Priority**: Minimum viable features only

---

## Phase 0: Foundation & Infrastructure (Week 1) 🚀 START HERE

### Objectives
- Set up development environment
- Database schema implementation
- Authentication & authorization foundation
- Next.js project structure with API routes

### Deliverables
1. **Project Setup**
   - Next.js 14+ project (App Router)
   - Express API routes structure
   - TypeScript configuration
   - Environment variables setup (.env.local)
   - Google Cloud SQL connection setup

2. **Database Setup**
   - Supabase PostgreSQL setup (local/staging)
   - Database migrations system (node-pg-migrate)
   - Connection pooling (pg-pool)
   - Seed data: sample roles, Mall Alpha
   - Environment variables for database connection

3. **Authentication System**
   - User model with roles (Admin, Leasing Manager, Property Manager, Finance, Tenant User, Auditor)
   - JWT token generation/validation (jsonwebtoken)
   - Password hashing (bcrypt)
   - HTTP-only cookie + refresh token rotation
   - Basic RBAC middleware
   - Login/refresh endpoints

4. **API Foundation**
   - API route structure (`/api/v1`)
   - Error handling middleware
   - Request validation (Zod recommended)
   - Health check endpoint

### Acceptance Criteria
- ✅ Database schema matches PRD (all MVP tables)
- ✅ Can create users with roles
- ✅ JWT auth works (login, refresh with HTTP-only cookies)
- ✅ Health check returns 200
- ✅ Environment variables properly configured
- ✅ Supabase connection working (local)
- ✅ Can run migrations successfully

### Testing Checklist
- [ ] Database connection successful
- [ ] User creation with roles
- [ ] Login generates JWT + refresh token
- [ ] Protected routes require authentication
- [ ] Database constraints enforced (foreign keys, unique)

---

## Phase 1A: Master Data Management (Week 2)

### Objectives
- Mall hierarchy (Malls → Buildings → Floors → Units) - Mall Alpha only
- Tenant master data
- Basic CRUD APIs + Frontend

### Deliverables
1. **Mall & Space Management APIs**
   - `POST/GET/PUT /api/v1/malls`
   - `POST/GET /api/v1/buildings?mall_id=`
   - `POST/GET /api/v1/floors?building_id=`
   - `POST/GET/PUT /api/v1/units?floor_id=`
   - Unit status management
   - Unit validation (no overlapping leases - basic check)

2. **Tenant Management APIs**
   - `POST/GET/GET/{id}/PUT /api/v1/tenants`
   - `POST/GET /api/v1/tenants/{id}/contacts`
   - Tenant tax profile fields (VAT_REGISTERED/NON_VAT, withholding)
   - TIN encryption (at rest via application layer)

3. **Frontend Pages (Next.js)**
   - Mall/unit hierarchy view (list/tree)
   - Tenant list/form (CRUD)
   - Role-based access (Admin/Leasing Manager can edit)
   - Basic authentication checks

### Acceptance Criteria
- ✅ Can create full mall hierarchy (mall → building → floor → unit) for Mall Alpha
- ✅ Units have proper status lifecycle
- ✅ Tenant records include PH-specific fields (VAT profile, TIN)
- ✅ TIN is encrypted in database
- ✅ Unit uniqueness enforced (floor_id + unit_code)
- ✅ Frontend CRUD pages work

### Testing Checklist
- [ ] Create mall hierarchy end-to-end via API
- [ ] Create via frontend works
- [ ] Unit status transitions
- [ ] Tenant CRUD with tax profiles
- [ ] Validation: duplicate unit codes prevented
- [ ] RBAC: only authorized roles can create/edit

---

## Phase 1B: Lease Management & Charges (Week 3)

### Objectives
- Lease creation and lifecycle
- Charge definitions (BASE_RENT, CAM)
- Basic tax rules (simple VAT/Non-VAT)

### Deliverables
1. **Lease APIs**
   - `POST/GET/GET/{id}/PUT /api/v1/leases`
   - `POST /api/v1/leases/{id}/activate`
   - `POST /api/v1/leases/{id}/terminate`
   - Lease validation (unit availability, date overlaps)
   - Automatic unit status update on lease activation

2. **Charge Rules APIs** (simplified - basic tax only)
   - `POST/GET /api/v1/leases/{id}/charges`
   - `PUT /api/v1/lease-charges/{id}`
   - Charge types: BASE_RENT, CAM (MVP: skip UTILITIES, MARKETING_FUND if not critical)
   - Calculation methods: FIXED, PER_SQM
   - Basic tax rules: VAT (12%) or Non-VAT based on tenant profile

3. **Tax Rules APIs** (simplified)
   - `POST/GET /api/v1/tax-rules`
   - Default tax rules: VAT_REGISTERED (12% VAT), NON_VAT (0% VAT)
   - Link to tenant VAT profile

4. **Frontend Pages**
   - Lease list/form
   - Charge management UI

### Acceptance Criteria
- ✅ Can create lease with start/end dates
- ✅ System prevents double-leasing (overlapping dates on same unit)
- ✅ Unit status auto-updates to "leased" when lease activated
- ✅ Charges can be defined per lease (BASE_RENT, CAM)
- ✅ Tax rules apply based on tenant VAT profile

### Testing Checklist
- [ ] Create lease → unit status changes
- [ ] Prevent overlapping leases on same unit
- [ ] Charge rules saved correctly
- [ ] VAT tenant: VAT applied
- [ ] Non-VAT tenant: no VAT
- [ ] Lease termination updates unit status

**Note**: Lease amendments can be deferred to Phase 2 (MVP focus on core leasing)

---

## Phase 1C: Invoicing System (Week 4)

### Objectives
- Invoice generation from lease charges
- Invoice lifecycle (draft → issued → paid)
- Basic charge calculation & tax application

### Deliverables
1. **Charge Calculation Engine**
   - Calculate charges based on rules (FIXED, PER_SQM)
   - Apply tax rules based on tenant VAT profile
   - Calculate VAT amounts (12% for VAT-registered)
   - **MVP**: Skip withholding for now (can add in Phase 2)

2. **Invoice Generation**
   - `POST /api/v1/invoices/generate` (single lease, single period)
   - Generate invoices for billing period based on lease charges
   - Create invoice_lines as snapshots of lease_charges
   - Calculate totals (subtotal, tax_total, total_due)
   - Invoice numbering (unique per mall - sequential)

3. **Invoice Management**
   - `GET /api/v1/invoices` (with filters: tenant, lease, status, date range)
   - `GET /api/v1/invoices/{id}`
   - `POST /api/v1/invoices/{id}/issue`
   - `POST /api/v1/invoices/{id}/void`
   - Invoice states: draft → issued → partially_paid → paid → void

4. **Frontend Pages**
   - Invoice list/view
   - Invoice generation UI
   - Invoice detail page

### Acceptance Criteria
- ✅ Invoices generated from active lease charges
- ✅ Invoice line items are snapshots (don't change if charge rule changes)
- ✅ Invoice totals are correct (subtotal + tax = total_due)
- ✅ Invoice numbers are unique per mall
- ✅ Once issued, invoice totals cannot be modified directly

### Testing Checklist
- [ ] Generate invoice for active lease
- [ ] Invoice lines match lease charges
- [ ] Invoice totals calculate correctly (with VAT)
- [ ] Invoice number uniqueness enforced
- [ ] Cannot modify issued invoice totals
- [ ] Void invoice works correctly

**Note**: Escalations deferred to Phase 2. MVP focuses on fixed charges.

---

## Phase 1D: Payments & Collections (Week 5)

### Objectives
- Payment recording
- Payment allocation to invoices
- AR aging reports

### Deliverables
1. **Payment APIs**
   - `POST/GET/GET/{id} /api/v1/payments`
   - Payment methods (cash, bank_transfer, gcash, check)
   - Payment reference tracking

2. **Payment Allocation**
   - `POST /api/v1/payments/{id}/allocate`
   - Allocate payment to one or multiple invoices
   - Partial payment support
   - Update invoice status automatically (paid/partially_paid)

3. **AR Aging Report**
   - `GET /api/v1/ar/aging`
   - Buckets: 0-30, 31-60, 61-90, 90+ days
   - Filter by mall (Mall Alpha), tenant, date range
   - Total outstanding per bucket

4. **Statements of Account**
   - Generate SOA per tenant/lease (API endpoint)
   - Show invoices, payments, outstanding balance

5. **Frontend Pages**
   - Payment recording form
   - Payment allocation UI
   - AR aging report view
   - SOA view

### Acceptance Criteria
- ✅ Payments can be recorded with method and reference
- ✅ Payments can be allocated to multiple invoices
- ✅ Invoice status updates based on payment allocation
- ✅ AR aging report shows correct buckets
- ✅ SOA shows accurate balance

### Testing Checklist
- [ ] Record payment
- [ ] Allocate payment to invoice → status updates
- [ ] Partial payment allocation
- [ ] AR aging buckets correct
- [ ] SOA balance matches invoice - payments

---

## Phase 1E: Basic Dashboards & Reporting (Week 6)

### Objectives
- Occupancy reports
- Revenue reports
- Lease expiry tracking
- Basic exports (CSV)

### Deliverables
1. **Reporting APIs** (simplified for MVP)
   - `GET /api/v1/reports/occupancy` (by mall/floor - Mall Alpha)
   - `GET /api/v1/reports/revenue` (total revenue, per sqm basic)
   - `GET /api/v1/reports/lease-expiry` (next 30/60/90 days)
   - `GET /api/v1/reports/ar-aging` (already in Phase 1D, consolidate)

2. **Dashboard Frontend** (basic)
   - Occupancy % by floor (Mall Alpha)
   - Revenue summary (total, this month)
   - Upcoming lease expiries (list)
   - AR aging summary

3. **Export Functionality**
   - CSV export for reports (basic)
   - CSV export for SOA

### Acceptance Criteria
- ✅ Occupancy calculated correctly (leased units / total units)
- ✅ Revenue reports show accurate totals
- ✅ Lease expiry report shows upcoming expiries (next 90 days)
- ✅ CSV exports work correctly

### Testing Checklist
- [ ] Occupancy % matches manual calculation
- [ ] Revenue totals match invoice totals
- [ ] Lease expiry shows correct dates
- [ ] CSV exports contain correct data

---

## Phase 1 MVP Complete - Review & Testing (Week 7)

### Objectives
- End-to-end testing
- Bug fixes
- Basic performance checks
- Deployment preparation
- User acceptance testing preparation

### Deliverables
1. **Integration Testing**
   - Full lease lifecycle (create → activate → invoice → pay)
   - Edge cases (overlapping dates, partial payments)
   - Multi-tenant scenarios (multiple tenants, multiple leases)

2. **Basic Performance Checks**
   - Database query optimization (indexes on foreign keys, frequent queries)
   - API response time checks (target: <500ms for most endpoints)
   - **Note**: Full 10k invoices/month testing may be deferred to production monitoring

3. **Security Audit** (basic)
   - RBAC enforcement verified
   - TIN encryption verified
   - SQL injection prevention (parameterized queries)
   - XSS prevention (Next.js built-in protection)
   - HTTP-only cookies verified

4. **Documentation** (minimal for MVP)
   - API endpoint list (updated)
   - Basic deployment guide
   - User guide for key workflows (lease creation, invoicing, payments)

5. **Deployment Setup**
   - Staging environment (Vercel/Google Cloud)
   - Environment variables configured
   - Database connection (Google Cloud SQL)
   - Google Cloud Storage setup

### Acceptance Criteria
- ✅ All MVP features work end-to-end
- ✅ No critical bugs
- ✅ Security basics verified (RBAC, encryption)
- ✅ Can deploy to staging
- ✅ Basic documentation available

### Testing Checklist
- [ ] Full lease lifecycle works end-to-end
- [ ] All critical paths tested
- [ ] No data loss scenarios
- [ ] Authentication/authorization works correctly
- [ ] Can deploy to staging successfully

---

---

## Phase 2: Post-MVP Features (After March 2026)

**Note**: These features are deferred from MVP and will be implemented after MVP launch based on user feedback and priorities.

---

## Phase 2A: Percentage Rent & Sales Reporting (Post-MVP)

### Objectives
- Tenant sales submission portal
- Percentage rent calculation
- Sales audit features

### Deliverables
1. **Sales Reporting APIs**
   - `POST/GET /sales-reports?lease_id=`
   - `POST /sales-reports/{id}/approve`
   - `POST /sales-reports/{id}/reject`
   - Tenant portal for sales submission
   - Attachment support (PDF uploads)

2. **Percentage Rent Calculation**
   - Calculate % rent from gross sales
   - Minimum rent logic (if applicable)
   - Generate reconciliation invoice for % rent difference

3. **Sales Audit Features**
   - Flag missing sales reports
   - Detect suspicious drops/spikes
   - Approval workflow for sales reports

### Acceptance Criteria
- ✅ Tenants can submit monthly sales
- ✅ % rent calculates correctly (sales × % or minimum rent)
- ✅ Reconciliation invoices generated for differences
- ✅ Sales audit flags work
- ✅ Approval workflow enforced

---

## Phase 2B: OR/SI Tracking & Adjustments (Week 21-22)

### Objectives
- Official Receipt / Sales Invoice tracking
- Credit/Debit memo system
- Document attachment management

### Deliverables
1. **OR/SI Tracking**
   - Store OR/SI numbers, dates in invoice.official_ref JSONB
   - Attachment uploads (PDF scans)
   - Link OR/SI to invoices

2. **Adjustments System**
   - `POST /invoices/{id}/adjustments`
   - Credit memos (negative adjustments)
   - Debit memos (positive adjustments)
   - Adjustment reasons and audit trail

3. **Document Management**
   - File storage for OR/SI, attachments
   - Document retrieval APIs

### Acceptance Criteria
- ✅ OR/SI can be linked to invoices
- ✅ Attachments can be uploaded and retrieved
- ✅ Credit/debit memos adjust invoice totals correctly
- ✅ All adjustments are auditable

---

## Phase 2C: Approval Workflows (Week 23-24)

### Objectives
- Approval flows for critical actions
- Notification system
- Workflow engine

### Deliverables
1. **Approval Workflows**
   - New lease creation approval
   - Discount/concession approval
   - Penalty waiver approval
   - Renewal approval

2. **Notification System**
   - Email notifications
   - In-app notifications
   - Approval request notifications

3. **Workflow Engine**
   - Configurable approval chains
   - Role-based approvers
   - Approval history

### Acceptance Criteria
- ✅ Approval workflows enforced for specified actions
- ✅ Notifications sent to approvers
- ✅ Approval history tracked
- ✅ Role-based approvers work correctly

---

## Phase 3: Integrations & Advanced Features (Post-MVP)

### Objectives
- External system integrations
- Advanced analytics
- Forecasting

### Deliverables
1. **Integrations**
   - Accounting system export (CSV/API)
   - Payment gateway integration (optional)
   - POS integration (optional)

2. **Advanced Analytics**
   - Revenue forecasting
   - Occupancy trends
   - Tenant performance analytics

3. **Additional Features**
   - Document compliance module (BIR/permits tracking)
   - Advanced reporting
   - Custom dashboards

---

## Phase Completion Criteria

Before proceeding to the next phase:
1. ✅ All features in current phase are implemented
2. ✅ All acceptance criteria met
3. ✅ Unit tests written and passing (>80% coverage)
4. ✅ Integration tests passing
5. ✅ Code review completed
6. ✅ Documentation updated
7. ✅ Demo to stakeholders completed
8. ✅ **Explicit approval from you to proceed**

---

## Risk Mitigation

1. **Database Performance**: Index optimization, query tuning at each phase
2. **Tax Calculation Complexity**: Start with simple rules, extend gradually
3. **Data Migration**: Plan early if legacy data exists
4. **User Adoption**: Involve end-users in UAT early (Phase 1F)

---

## MVP Timeline Summary (6-7 Weeks)

| Phase | Week | Focus | Status |
|-------|------|-------|--------|
| Phase 0 | Week 1 | Foundation & Infrastructure | ⏳ Pending Approval |
| Phase 1A | Week 2 | Master Data (Malls, Units, Tenants) | ⏳ Pending |
| Phase 1B | Week 3 | Lease Management & Charges | ⏳ Pending |
| Phase 1C | Week 4 | Invoicing System | ⏳ Pending |
| Phase 1D | Week 5 | Payments & Collections | ⏳ Pending |
| Phase 1E | Week 6 | Basic Dashboards & Reports | ⏳ Pending |
| Review | Week 7 | Testing, Bug Fixes, Deployment | ⏳ Pending |

**Target Go-Live**: March 2026

---

## MVP Scope Summary (What's IN vs OUT)

### ✅ IN MVP (Phase 1)
- Mall Alpha only (single mall)
- Fixed rent + CAM charges
- Basic VAT/Non-VAT tax (12% VAT)
- Invoice generation (monthly billing)
- Payments & allocations
- AR aging reports
- Basic occupancy & revenue reports
- CSV exports

### ❌ OUT MVP (Deferred to Phase 2)
- Percentage rent (% sales)
- Lease amendments (versioning)
- Withholding tax (EWT/WHT)
- OR/SI tracking
- Credit/Debit memos
- Approval workflows
- Escalations
- Multi-mall support (beyond Mall Alpha structure)
- Advanced analytics
- Integrations

---

## Next Steps

1. ✅ **Tech stack confirmed** (Node.js/Express, Next.js, Google Cloud SQL, etc.)
2. ✅ **Business context confirmed** (Mall Alpha, no existing data, March 2026 target)
3. ⏳ **Review and approve this plan** → Begin Phase 0 implementation
4. ⏳ **Review after each phase** before proceeding to next phase

---

## Technology Decisions (Confirmed)

1. **Project Structure**: ✅ Separate backend/frontend repos (not monorepo)
2. **Database Migrations**: ✅ node-pg-migrate
3. **Database (Local/Staging)**: ✅ Supabase (PostgreSQL)
4. **Database (Production)**: Google Cloud SQL (PostgreSQL) - later
5. **Deployment (Local/Staging)**: ✅ Vercel + Supabase
6. **Deployment (Production)**: Google Cloud (later)
7. **Development**: Run locally for demos

---

## Project Structure

```
leasing/
├── backend/          # Express API (Node.js/TypeScript)
│   ├── src/
│   ├── migrations/   # node-pg-migrate migrations
│   └── package.json
│
└── frontend/         # Next.js (React/TypeScript)
    ├── app/
    ├── components/
    └── package.json
```

---

## Next Steps

✅ **All decisions confirmed**
⏳ **Ready to start Phase 0** → Set up project structure and foundation

