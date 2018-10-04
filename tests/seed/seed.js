import jwt from 'jsonwebtoken';
import pool from '../../server/db/config';

const adminEmail = 'hovkard@gmail.com';


const users = {
  admin: {
    id: 1,
    name: 'Kizito',
    email: adminEmail,
    password: 'suppersecurepassword',
    confirmPassword: 'suppersecurepassword',
  },
  validUser: {
    id: 2,
    name: 'James',
    email: 'daniel@james.com',
    password: 'pixel2user',
    confirmPassword: 'pixel2user',
  },
  validUserTwo: {
    id: 3,
    name: 'Philip',
    email: 'philip@new.man',
    password: 'facilitate',
    confirmPassword: 'facilitate',
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
};

function generateValidToken(userObject) {
  return jwt.sign({
    userId: userObject.id,
    userName: userObject.name,
    userEmail: userObject.email,
    userStatus: userObject.email === adminEmail ? 'admin' : 'customer',
  }, process.env.JWT_SECRET).toString();
}

const emptyTables = async () => {
  const dropUsersTableQuery = 'DROP TABLE IF EXISTS users CASCADE';
  const dropMenuTableQuery = 'DROP TABLE IF EXISTS menu CASCADE';
  const dropOrdersTableQuery = 'DROP TABLE IF EXISTS orders CASCADE';

  const createUsersTableQuery = `CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL
  )`;

  const createMenuTableQuery = `CREATE TABLE menu (
    id serial PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    food_image VARCHAR(255) NOT NULL DEFAULT 'https://i.imgur.com/yRLsidK.jpg',
    price REAL NOT NULL
  )`;

  const createOrdersTableQuery = `CREATE TABLE orders (
    id serial PRIMARY KEY,
    item INTEGER REFERENCES menu(id),
    author INTEGER REFERENCES users(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'new'
  )`;

  await pool.query(dropUsersTableQuery);
  await pool.query(dropMenuTableQuery);
  await pool.query(dropOrdersTableQuery);
  await pool.query(createUsersTableQuery);
  await pool.query(createMenuTableQuery);
  await pool.query(createOrdersTableQuery);
};

export {
  users,
  emptyTables,
  generateValidToken,
};
