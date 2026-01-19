export const malls = [
  {
    id: 'mall-alpha',
    name: 'Mall Alpha',
    address: 'Pasig City, Metro Manila',
    occupancy: 92,
    totalUnits: 120,
  },
  {
    id: 'mall-beta',
    name: 'Mall Beta',
    address: 'Quezon City, Metro Manila',
    occupancy: 86,
    totalUnits: 95,
  },
];

export const units = [
  { id: 'u-101', code: 'A-101', floor: 'Ground', type: 'Inline', status: 'Leased', area: 45 },
  { id: 'u-102', code: 'A-102', floor: 'Ground', type: 'Inline', status: 'Available', area: 38 },
  { id: 'u-201', code: 'B-201', floor: 'Second', type: 'Kiosk', status: 'Leased', area: 12 },
  { id: 'u-301', code: 'C-301', floor: 'Third', type: 'Anchor', status: 'Leased', area: 320 },
  { id: 'u-401', code: 'D-401', floor: 'Fourth', type: 'Inline', status: 'Reserved', area: 56 },
];

export const unitMapByFloor: Record<string, { id: string; status: string }[]> = {
  Ground: [
    { id: 'A-101', status: 'Leased' },
    { id: 'A-102', status: 'Available' },
    { id: 'A-103', status: 'Available' },
    { id: 'A-104', status: 'Reserved' },
    { id: 'A-105', status: 'Leased' },
  ],
  Second: [
    { id: 'B-201', status: 'Leased' },
    { id: 'B-202', status: 'Available' },
    { id: 'B-203', status: 'Available' },
    { id: 'B-204', status: 'Reserved' },
  ],
  Third: [
    { id: 'C-301', status: 'Leased' },
    { id: 'C-302', status: 'Reserved' },
    { id: 'C-303', status: 'Available' },
  ],
};

export const tenants = [
  { id: 't-1', name: 'Cafe Luna', vat: 'VAT_REGISTERED', contact: 'cafe@luna.ph', industry: 'F&B', phone: '+63 917 111 2222' },
  { id: 't-2', name: 'Nova Fashion', vat: 'NON_VAT', contact: 'hello@nova.ph', industry: 'Retail', phone: '+63 917 333 4444' },
  { id: 't-3', name: 'Tech Hive', vat: 'VAT_REGISTERED', contact: 'ops@techhive.ph', industry: 'Electronics', phone: '+63 917 555 6666' },
];

export const tenantDocuments: Record<string, { name: string; status: 'Complete' | 'Pending' | 'Expired' }[]> = {
  't-1': [
    { name: 'BIR Registration', status: 'Complete' },
    { name: 'Business Permit', status: 'Complete' },
    { name: 'Fire Safety Certificate', status: 'Pending' },
  ],
  't-2': [
    { name: 'BIR Registration', status: 'Complete' },
    { name: 'DTI Registration', status: 'Expired' },
    { name: 'Insurance', status: 'Pending' },
  ],
  't-3': [
    { name: 'SEC Registration', status: 'Complete' },
    { name: 'Business Permit', status: 'Complete' },
    { name: 'Insurance', status: 'Complete' },
  ],
};

export const tenantComplianceTimeline: Record<string, { date: string; title: string; status: 'Done' | 'Pending' }[]> = {
  't-1': [
    { date: 'Dec 15, 2025', title: 'Submitted BIR Form 2303', status: 'Done' },
    { date: 'Jan 05, 2026', title: 'Business Permit Renewal', status: 'Pending' },
  ],
  't-2': [
    { date: 'Nov 20, 2025', title: 'DTI Registration Expired', status: 'Pending' },
    { date: 'Jan 08, 2026', title: 'Insurance Under Review', status: 'Pending' },
  ],
  't-3': [
    { date: 'Dec 10, 2025', title: 'SEC Registration Updated', status: 'Done' },
    { date: 'Jan 02, 2026', title: 'Business Permit Renewed', status: 'Done' },
  ],
};

export const leases = [
  { id: 'l-1', tenant: 'Cafe Luna', unit: 'A-101', start: '2025-02-01', end: '2026-01-31', status: 'Active', rent: 85000 },
  { id: 'l-2', tenant: 'Nova Fashion', unit: 'B-201', start: '2025-06-01', end: '2026-05-31', status: 'Active', rent: 42000 },
  { id: 'l-3', tenant: 'Tech Hive', unit: 'C-301', start: '2025-03-15', end: '2028-03-14', status: 'Active', rent: 180000 },
];

export const renewals = [
  { id: 'r-1', tenant: 'Cafe Luna', unit: 'A-101', expires: '2026-01-31', status: 'Due in 30 days', action: 'Negotiate' },
  { id: 'r-2', tenant: 'Nova Fashion', unit: 'B-201', expires: '2026-05-31', status: 'Due in 120 days', action: 'Prepare' },
  { id: 'r-3', tenant: 'Tech Hive', unit: 'C-301', expires: '2028-03-14', status: 'On Track', action: 'Monitor' },
];

export const renewalPipeline = {
  "Due Soon": [
    { id: 'r-1', tenant: 'Cafe Luna', unit: 'A-101', expires: '2026-01-31' },
  ],
  "In Negotiation": [
    { id: 'r-2', tenant: 'Nova Fashion', unit: 'B-201', expires: '2026-05-31' },
  ],
  "Approved": [
    { id: 'r-3', tenant: 'Tech Hive', unit: 'C-301', expires: '2028-03-14' },
  ],
};

export const invoices = [
  { id: 'inv-001', tenant: 'Cafe Luna', period: 'Jan 2026', total: 85000, status: 'Issued' },
  { id: 'inv-002', tenant: 'Nova Fashion', period: 'Jan 2026', total: 42000, status: 'Partially Paid' },
  { id: 'inv-003', tenant: 'Tech Hive', period: 'Jan 2026', total: 180000, status: 'Issued' },
];

export const payments = [
  { id: 'pay-001', tenant: 'Cafe Luna', amount: 85000, method: 'Bank Transfer', date: '2026-01-05' },
  { id: 'pay-002', tenant: 'Nova Fashion', amount: 20000, method: 'GCash', date: '2026-01-08' },
  { id: 'pay-003', tenant: 'Tech Hive', amount: 180000, method: 'Bank Transfer', date: '2026-01-07' },
];

export const allocations = [
  { id: 'alloc-001', paymentId: 'pay-002', invoiceId: 'inv-002', amount: 20000 },
];

export const arAging = [
  { tenant: 'Cafe Luna', current: 0, days30: 0, days60: 0, days90: 0, days90plus: 0 },
  { tenant: 'Nova Fashion', current: 22000, days30: 12000, days60: 0, days90: 0, days90plus: 0 },
  { tenant: 'Tech Hive', current: 0, days30: 0, days60: 0, days90: 0, days90plus: 0 },
];

export const arAgingSummary = [
  { bucket: 'Current', amount: 22000 },
  { bucket: '0-30', amount: 12000 },
  { bucket: '31-60', amount: 0 },
  { bucket: '61-90', amount: 0 },
  { bucket: '90+', amount: 0 },
];

export const dashboard = {
  occupancy: 89,
  revenueThisMonth: 307000,
  overdue: 12000,
  leasesExpiring: 3,
};

export const revenueSeries = [
  { month: 'Aug', revenue: 240000 },
  { month: 'Sep', revenue: 255000 },
  { month: 'Oct', revenue: 265000 },
  { month: 'Nov', revenue: 278000 },
  { month: 'Dec', revenue: 296000 },
  { month: 'Jan', revenue: 307000 },
];
