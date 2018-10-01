import bcrypt from 'bcryptjs';
import pool from '../../server/db/config';

const seedData = {
  users: {
    admin: {
      name: 'Kizito',
      email: 'hovkard@gmail.com',
      password: 'suppersecurepassword',
      confirmPassword: 'suppersecurepassword',
    },
    validUser: {
      name: 'James',
      email: 'daniel@james.com',
      password: 'pixel2user',
      confirmPassword: 'pixel2user',
    },
    validUserInvalidPass: {
      email: 'daniel@james.com',
      password: 'thisiswrong',
    },
    invalidUser: {
      name: 'four-O-four',
      email: 'no@email.address',
      password: 'invalid',
    },
    invalidUserNoData: {},
    invalidUserNoName: {
      email: 'unserious@lad.com',
      password: 'insecure',
      confirmPassword: 'insecure',
    },
    invalidUserNoEmail: {
      name: 'Name?',
      password: 'pass',
      confirmPassword: 'pass',
    },
    invalidUserNoPass: {
      name: 'Magician',
      email: 'an@email.address',
    },
    invalidUserPassMissMatch: {
      name: 'Olodo',
      email: 'another@sweet.email',
      password: 'oneThing',
      confirmPassword: 'anEntirelyDifferentThing',
    },
  },
};

const populateTables = async () => {
  const dropUsersTableQuery = 'DROP TABLE IF EXISTS users';

  const createUsersTableQuery = `CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL
  )`;

  await pool.query(dropUsersTableQuery);
  await pool.query(createUsersTableQuery);
};

const populateUsersTable = async () => {
  // hash passwords
  const adminHashedPassword = await bcrypt.hash(seedData.users.admin.password, 10);
  const userHashedPassword = await bcrypt.hash(seedData.users.validUser.password, 10);
  const insertQuery = 'INSERT INTO users(name, email, password, is_admin) VALUES($1, $2, $3, $4)';
  // Admin user
  await pool.query(
    insertQuery,
    [seedData.users.admin.name, seedData.users.admin.email, adminHashedPassword, 't'],
  );
  // Customer
  await pool.query(
    insertQuery,
    [seedData.users.validUser.name, seedData.users.validUser.email, userHashedPassword, 'f'],
  );
};

export { seedData, populateTables, populateUsersTable };
