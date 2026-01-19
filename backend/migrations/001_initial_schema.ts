import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Users table (for authentication - Phase 0)
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    email: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: 'text',
      notNull: true,
    },
    role: {
      type: 'text',
      notNull: true,
      check: "role IN ('ADMIN', 'LEASING_MANAGER', 'PROPERTY_MANAGER', 'FINANCE', 'TENANT_USER', 'AUDITOR')",
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
    },
  });

  // Refresh tokens table (for JWT refresh token rotation)
  pgm.createTable('refresh_tokens', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    token: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('refresh_tokens', 'user_id');
  pgm.createIndex('refresh_tokens', 'token');

  // Malls table (Phase 1A)
  pgm.createTable('malls', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    name: {
      type: 'text',
      notNull: true,
    },
    legal_entity_name: {
      type: 'text',
    },
    address: {
      type: 'text',
    },
    timezone: {
      type: 'text',
      default: 'Asia/Manila',
    },
    currency: {
      type: 'text',
      default: 'PHP',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  // Buildings table
  pgm.createTable('buildings', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    mall_id: {
      type: 'uuid',
      notNull: true,
      references: 'malls(id)',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'text',
      notNull: true,
    },
  });

  pgm.createIndex('buildings', 'mall_id');

  // Floors table
  pgm.createTable('floors', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    building_id: {
      type: 'uuid',
      notNull: true,
      references: 'buildings(id)',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'text',
      notNull: true,
    },
    level_no: {
      type: 'integer',
    },
  });

  pgm.createIndex('floors', 'building_id');

  // Units table
  pgm.createTable('units', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    floor_id: {
      type: 'uuid',
      notNull: true,
      references: 'floors(id)',
      onDelete: 'CASCADE',
    },
    unit_code: {
      type: 'text',
      notNull: true,
    },
    unit_type: {
      type: 'text',
      notNull: true,
      check: "unit_type IN ('inline', 'kiosk', 'anchor', 'pop-up')",
    },
    zone: {
      type: 'text',
    },
    area_sqm: {
      type: 'numeric(12,2)',
      notNull: true,
    },
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('available', 'reserved', 'leased', 'blocked', 'renovation')",
      default: 'available',
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
  });

  pgm.createIndex('units', 'floor_id');
  pgm.createUniqueConstraint('units', 'units_floor_id_unit_code_unique', {
    columns: ['floor_id', 'unit_code'],
  });

  // Tenants table (Phase 1A)
  pgm.createTable('tenants', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    tenant_name: {
      type: 'text',
      notNull: true,
    },
    trade_name: {
      type: 'text',
    },
    tin_encrypted: {
      type: 'text',
    },
    vat_profile: {
      type: 'text',
      notNull: true,
      check: "vat_profile IN ('VAT_REGISTERED', 'NON_VAT', 'EXEMPT')",
    },
    withholding_profile: {
      type: 'text',
    },
    billing_address: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  // Tenant contacts table
  pgm.createTable('tenant_contacts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'text',
      notNull: true,
    },
    email: {
      type: 'text',
    },
    phone: {
      type: 'text',
    },
    role: {
      type: 'text',
    },
  });

  pgm.createIndex('tenant_contacts', 'tenant_id');

  // Leases table (Phase 1B)
  pgm.createTable('leases', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    mall_id: {
      type: 'uuid',
      notNull: true,
      references: 'malls(id)',
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
    },
    unit_id: {
      type: 'uuid',
      notNull: true,
      references: 'units(id)',
    },
    lease_no: {
      type: 'text',
    },
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('draft', 'active', 'expired', 'terminated')",
      default: 'draft',
    },
    start_date: {
      type: 'date',
      notNull: true,
    },
    end_date: {
      type: 'date',
      notNull: true,
    },
    billing_frequency: {
      type: 'text',
      notNull: true,
      check: "billing_frequency IN ('monthly', 'quarterly')",
    },
    escalation_policy: {
      type: 'jsonb',
      default: '{}',
    },
    deposit_policy: {
      type: 'jsonb',
      default: '{}',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('leases', 'mall_id');
  pgm.createIndex('leases', 'tenant_id');
  pgm.createIndex('leases', 'unit_id');
  pgm.createIndex('leases', 'status');

  // Lease amendments table (Phase 2)
  pgm.createTable('lease_amendments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    lease_id: {
      type: 'uuid',
      notNull: true,
      references: 'leases(id)',
      onDelete: 'CASCADE',
    },
    amendment_no: {
      type: 'text',
    },
    effective_date: {
      type: 'date',
      notNull: true,
    },
    changes: {
      type: 'jsonb',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('lease_amendments', 'lease_id');

  // Tax rules table (Phase 1B)
  pgm.createTable('tax_rules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    name: {
      type: 'text',
      notNull: true,
    },
    rule: {
      type: 'jsonb',
      notNull: true,
    },
  });

  // Lease charges table (Phase 1B)
  pgm.createTable('lease_charges', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    lease_id: {
      type: 'uuid',
      notNull: true,
      references: 'leases(id)',
      onDelete: 'CASCADE',
    },
    charge_type: {
      type: 'text',
      notNull: true,
      check: "charge_type IN ('BASE_RENT', 'CAM', 'UTILITIES', 'MARKETING_FUND', 'OTHER')",
    },
    calc_method: {
      type: 'text',
      notNull: true,
      check: "calc_method IN ('FIXED', 'PER_SQM', 'METERED', 'PERCENT_SALES')",
    },
    amount: {
      type: 'numeric(14,2)',
    },
    rate: {
      type: 'numeric(10,4)',
    },
    start_date: {
      type: 'date',
      notNull: true,
    },
    end_date: {
      type: 'date',
    },
    tax_rule_id: {
      type: 'uuid',
      references: 'tax_rules(id)',
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
  });

  pgm.createIndex('lease_charges', 'lease_id');
  pgm.createIndex('lease_charges', 'tax_rule_id');

  // Invoices table (Phase 1C)
  pgm.createTable('invoices', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    mall_id: {
      type: 'uuid',
      notNull: true,
      references: 'malls(id)',
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
    },
    lease_id: {
      type: 'uuid',
      references: 'leases(id)',
    },
    invoice_no: {
      type: 'text',
      notNull: true,
    },
    period_start: {
      type: 'date',
      notNull: true,
    },
    period_end: {
      type: 'date',
      notNull: true,
    },
    issue_date: {
      type: 'date',
      notNull: true,
    },
    due_date: {
      type: 'date',
      notNull: true,
    },
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('draft', 'issued', 'partially_paid', 'paid', 'void')",
      default: 'draft',
    },
    subtotal: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    tax_total: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    withholding_total: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    total_due: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    official_ref: {
      type: 'jsonb',
      default: '{}',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('invoices', 'mall_id');
  pgm.createIndex('invoices', 'tenant_id');
  pgm.createIndex('invoices', 'lease_id');
  pgm.createIndex('invoices', 'status');
  pgm.createUniqueConstraint('invoices', 'invoices_mall_id_invoice_no_unique', {
    columns: ['mall_id', 'invoice_no'],
  });

  // Invoice lines table
  pgm.createTable('invoice_lines', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    invoice_id: {
      type: 'uuid',
      notNull: true,
      references: 'invoices(id)',
      onDelete: 'CASCADE',
    },
    lease_charge_id: {
      type: 'uuid',
      references: 'lease_charges(id)',
    },
    description: {
      type: 'text',
      notNull: true,
    },
    qty: {
      type: 'numeric(14,4)',
      notNull: true,
      default: 1,
    },
    unit_price: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    line_subtotal: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    line_tax: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    line_withholding: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    line_total: {
      type: 'numeric(14,2)',
      notNull: true,
      default: 0,
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
  });

  pgm.createIndex('invoice_lines', 'invoice_id');
  pgm.createIndex('invoice_lines', 'lease_charge_id');

  // Adjustments table (Phase 2)
  pgm.createTable('adjustments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    invoice_id: {
      type: 'uuid',
      notNull: true,
      references: 'invoices(id)',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'text',
      notNull: true,
      check: "type IN ('CREDIT', 'DEBIT')",
    },
    reason: {
      type: 'text',
    },
    amount: {
      type: 'numeric(14,2)',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('adjustments', 'invoice_id');

  // Payments table (Phase 1D)
  pgm.createTable('payments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    mall_id: {
      type: 'uuid',
      notNull: true,
      references: 'malls(id)',
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
    },
    payment_date: {
      type: 'date',
      notNull: true,
    },
    amount: {
      type: 'numeric(14,2)',
      notNull: true,
    },
    method: {
      type: 'text',
    },
    reference_no: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('payments', 'mall_id');
  pgm.createIndex('payments', 'tenant_id');
  pgm.createIndex('payments', 'payment_date');

  // Payment allocations table
  pgm.createTable('payment_allocations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    payment_id: {
      type: 'uuid',
      notNull: true,
      references: 'payments(id)',
      onDelete: 'CASCADE',
    },
    invoice_id: {
      type: 'uuid',
      notNull: true,
      references: 'invoices(id)',
      onDelete: 'CASCADE',
    },
    allocated_amount: {
      type: 'numeric(14,2)',
      notNull: true,
    },
  });

  pgm.createIndex('payment_allocations', 'payment_id');
  pgm.createIndex('payment_allocations', 'invoice_id');

  // Tenant sales reports table (Phase 2)
  pgm.createTable('tenant_sales_reports', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
    },
    lease_id: {
      type: 'uuid',
      notNull: true,
      references: 'leases(id)',
    },
    period_start: {
      type: 'date',
      notNull: true,
    },
    period_end: {
      type: 'date',
      notNull: true,
    },
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('submitted', 'approved', 'rejected')",
    },
    gross_sales: {
      type: 'numeric(14,2)',
      notNull: true,
    },
    attachments: {
      type: 'jsonb',
      default: '[]',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('tenant_sales_reports', 'tenant_id');
  pgm.createIndex('tenant_sales_reports', 'lease_id');

  // Audit logs table (Phase 0/1)
  pgm.createTable('audit_logs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    actor_user_id: {
      type: 'uuid',
      references: 'users(id)',
    },
    action: {
      type: 'text',
      notNull: true,
    },
    entity_type: {
      type: 'text',
      notNull: true,
    },
    entity_id: {
      type: 'uuid',
      notNull: true,
    },
    before_state: {
      type: 'jsonb',
    },
    after_state: {
      type: 'jsonb',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('audit_logs', 'actor_user_id');
  pgm.createIndex('audit_logs', 'entity_type');
  pgm.createIndex('audit_logs', 'entity_id');
  pgm.createIndex('audit_logs', 'created_at');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop tables in reverse order (respecting foreign keys)
  pgm.dropTable('audit_logs', { ifExists: true, cascade: true });
  pgm.dropTable('tenant_sales_reports', { ifExists: true, cascade: true });
  pgm.dropTable('payment_allocations', { ifExists: true, cascade: true });
  pgm.dropTable('payments', { ifExists: true, cascade: true });
  pgm.dropTable('adjustments', { ifExists: true, cascade: true });
  pgm.dropTable('invoice_lines', { ifExists: true, cascade: true });
  pgm.dropTable('invoices', { ifExists: true, cascade: true });
  pgm.dropTable('lease_charges', { ifExists: true, cascade: true });
  pgm.dropTable('tax_rules', { ifExists: true, cascade: true });
  pgm.dropTable('lease_amendments', { ifExists: true, cascade: true });
  pgm.dropTable('leases', { ifExists: true, cascade: true });
  pgm.dropTable('tenant_contacts', { ifExists: true, cascade: true });
  pgm.dropTable('tenants', { ifExists: true, cascade: true });
  pgm.dropTable('units', { ifExists: true, cascade: true });
  pgm.dropTable('floors', { ifExists: true, cascade: true });
  pgm.dropTable('buildings', { ifExists: true, cascade: true });
  pgm.dropTable('malls', { ifExists: true, cascade: true });
  pgm.dropTable('refresh_tokens', { ifExists: true, cascade: true });
  pgm.dropTable('users', { ifExists: true, cascade: true });
  pgm.dropExtension('uuid-ossp', { ifExists: true });
}
