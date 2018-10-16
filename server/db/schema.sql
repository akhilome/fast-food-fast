CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS menu (
  id serial PRIMARY KEY,
  food_name VARCHAR(255) NOT NULL,
  food_image VARCHAR(255) NOT NULL DEFAULT 'https://i.imgur.com/yRLsidK.jpg',
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  items TEXT NOT NULL,
  author INTEGER REFERENCES users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'new'
);
