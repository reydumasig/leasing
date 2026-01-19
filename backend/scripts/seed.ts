import dotenv from 'dotenv';
import pool from '../src/db/pool';
import { UserRole } from '../src/types';
import { createUser } from '../src/services/userService';

dotenv.config();

async function seed() {
  try {
    console.log('Seeding demo data...');

    const adminEmail = 'admin@mallalpha.com';
    const adminPassword = 'AdminPass123!';

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existing.rowCount === 0) {
      await createUser(adminEmail, adminPassword, UserRole.ADMIN);
      console.log(`Created admin user: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    await pool.query(
      `INSERT INTO malls (name, legal_entity_name, address)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      ['Mall Alpha', 'Mall Alpha Corp', 'Pasig City, Metro Manila']
    );

    console.log('Seed complete.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
