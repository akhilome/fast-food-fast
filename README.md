# KiaKiaFood

[![Build Status](https://travis-ci.org/akhilome/fast-food-fast.svg?branch=develop)](https://travis-ci.org/akhilome/fast-food-fast) [![Coverage Status](https://coveralls.io/repos/github/akhilome/fast-food-fast/badge.svg)](https://coveralls.io/github/akhilome/fast-food-fast) [![Maintainability](https://api.codeclimate.com/v1/badges/58776f26abc459607055/maintainability)](https://codeclimate.com/github/akhilome/fast-food-fast/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/58776f26abc459607055/test_coverage)](https://codeclimate.com/github/akhilome/fast-food-fast/test_coverage) 

## Getting Started

Make sure you have NodeJS (^v8.12.0), NPM (^v6.4.1), and PostgreSQL (^v10.5) installed.

#### Clone the project repo and cd into it:

```bash
git clone https://github.com/akhilome/fast-food-fast.git && cd fast-food-fast
```

#### Install the project dependencies:

```bash 
npm i
```

#### Setup required environmental variables

Rename the `.env.example` file to `.env` and replace the placeholders with valid data.

#### Setup database

With your database server running and you being in the project's root directory run the follow commands.

##### Setup database

```bash
npm run config-db && npm run seed-db
```

##### Setup test database

```bash
npm run setup-testdb
```

#### Start the app

```bash
npm start
```

then access any of the endpoints listed below

## Working Endpoints

| Endpoint                      | Functionality            | Notes  										 	   				    |
| ----------------------------- | ----------------------   | --------------------------------------     |
| POST /auth/signup             | Registers a User         |                                            |
| POST /auth/login              | Login a user             |                                            |
| POST /orders                  | Place an order for food  |                                            |
| GET /users/\<userId\>/orders  | Get the order history for a particular user. |                        |
| GET /menu                     | Get available menu       |                                            |
| POST /menu                    | Add an new meal to db    | Only admins can use this route             |
| GET /orders                   | Get all customer orders  | Only admins can use this route             |
| GET /orders/\<orderId\>       | Get the details of a specific order  | Only admins can use this route |
| PUT /orders/\<orderId\>       | Update the status of an order | Only admins can use this route        |


### Required Payload

#### `POST /auth/signup`

```json
{
  "name": "User's name",
  "email": "User's valid email",
  "password": "A password longer than 6 chars",
  "confirmPassWord": "The above password, again"
}
```

#### `POST /auth/login`

```json
{
  "email": "valid email address",
  "password": "valid password"
}
```

#### `POST /orders`

```json
{
  "foodId": "valid food id"
}
```

#### `POST /menu`

```json
{
  "foodName": "Name of new food",
  "foodImage": "URL of food image",
  "price": "Numeric price of food item"
}
```

#### `PUT /orders/\<orderId\>`

```json
{
  "status": "new status"
}
```

**Note:** the `status` passed to this route should be either of:

* `complete`
* `processing`
* `cancelled`

## Running Tests locally

Having setup the testdb above (`npm run setup-testdb`) you can run the test locally by running ...

```bash
npm test
```

... from the command line

## Deployment

* UI Templates => [GitHub Pages](https://akhilome.github.io/fast-food-fast/ui/) 
* API => [Heroku](https://kiakiafood.herokuapp.com/) 
* API docs => [Apiary](https://kiakiafood.docs.apiary.io)

## Tecnologies Used

* [Node JS](https://nodejs.org/en/) (_v8.12.0_) 
* [Expressjs](https://expressjs.com/)
* [Postgresql](https://www.postgresql.org/)
* [Babel](https://babeljs.io/)
* [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) for testing
* [ESLint](https://eslint.org/)

## Acknowledgements 

* [Andela](https://andela.com/)
