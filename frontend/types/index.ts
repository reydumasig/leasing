export enum UserRole {
  ADMIN = 'ADMIN',
  LEASING_MANAGER = 'LEASING_MANAGER',
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  FINANCE = 'FINANCE',
  TENANT_USER = 'TENANT_USER',
  AUDITOR = 'AUDITOR',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}
