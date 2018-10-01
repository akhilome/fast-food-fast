import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
/* eslint-disable */
let pool;

if (env === 'test') {
  pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export default pool;
