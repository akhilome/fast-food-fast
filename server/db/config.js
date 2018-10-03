import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const pool = env === 'test' ? new Pool({ connectionString: process.env.TEST_DATABASE_URL }) : new Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
