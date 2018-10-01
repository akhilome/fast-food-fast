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

export { seedData, populateTables };
