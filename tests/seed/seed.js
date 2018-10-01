import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../server/db/config';

const adminEmail = 'hovkard@gmail.com';

const seedData = {
  users: {
    admin: {
      id: null,
      name: 'Kizito',
      email: adminEmail,
      password: 'suppersecurepassword',
      confirmPassword: 'suppersecurepassword',
    },
    validUser: {
      id: null,
      name: 'James',
      email: 'daniel@james.com',
      password: 'pixel2user',
      confirmPassword: 'pixel2user',
    },
    validUserTwo: {
      id: null,
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
  },
  menu: [
    { name: 'Burger', price: 700 },
    { name: 'Spiced turkey', price: 1200 },
    { name: 'Interesting biscuits', price: 12500 },
  ],
};

// function generateValidToken(id, name, email) {
//   return jwt.sign({
//     userId: id,
//     userName: name,
//     userEmail: email,
//     userStatus: email === adminEmail ? 'admin' : 'customer',
//   }, process.env.JWT_SECRET).toString();
// }

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

const emptyTablesPromise = new Promise((resolve) => {
  resolve(emptyTables);
});

const populateUsersTable = async () => {
  // hash passwords
  const adminHashedPassword = await bcrypt.hash(seedData.users.admin.password, 10);
  const userOneHashedPassword = await bcrypt.hash(seedData.users.validUser.password, 10);
  const userTwoHashedPassword = await bcrypt.hash(seedData.users.validUserTwo.password, 10);
  const insertQuery = 'INSERT INTO users(name, email, password, is_admin) VALUES($1, $2, $3, $4) RETURNING id';
  // Admin user
  seedData.users.admin.id = (await pool.query(
    insertQuery,
    [seedData.users.admin.name, seedData.users.admin.email, adminHashedPassword, 't'],
  )).rows[0].id;
  // Customer 1
  seedData.users.validUser.id = (await pool.query(
    insertQuery,
    [seedData.users.validUser.name, seedData.users.validUser.email, userOneHashedPassword, 'f'],
  )).rows[0].id;
  // Customer 2
  seedData.users.validUserTwo.id = (await pool.query(
    insertQuery,
    [seedData.users.validUserTwo.name, seedData.users.validUserTwo.email, userTwoHashedPassword, 'f'],
  )).rows[0].id;
};

const populateUsersTablePromise = new Promise((resolve) => {
  resolve(populateUsersTable);
});

const populateMenuTable = () => {
  const insertQuery = 'INSERT INTO menu(food_name, price) VALUES($1, $2)';

  seedData.menu.forEach(async (food) => {
    await pool.query(insertQuery, [food.name, food.price]);
  });
};

const populateMenuTablePromise = new Promise((resolve) => {
  resolve(populateMenuTable);
});

const populateOrdersTable = async () => {
  const insertQuery = 'INSERT INTO orders(item, author) VALUES($1, $2)';
  const randomFoodId = Math.ceil(seedData.menu.length * Math.random());

  const orderOnePromise = pool.query(insertQuery, [randomFoodId, seedData.users.validUser.id]);
  const orderTwoPromise = pool.query(insertQuery, [randomFoodId, seedData.users.validUser.id]);
  const orderThreePromise = pool.query(insertQuery, [randomFoodId, seedData.users.validUserTwo.id]);
  const orderFourPromise = pool.query(insertQuery, [randomFoodId, seedData.users.validUser.id]);

  await Promise.all([orderOnePromise, orderTwoPromise, orderThreePromise, orderFourPromise]);
};

const populateOrdersTablePromise = new Promise((resolve) => {
  resolve(populateOrdersTable);
});

export {
  seedData,
  emptyTables,
  emptyTablesPromise,
  populateUsersTable,
  populateUsersTablePromise,
  populateMenuTable,
  populateMenuTablePromise,
  populateOrdersTable,
  populateOrdersTablePromise,
  generateValidToken,
};
