import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import dirtyChai from 'dirty-chai';

import app from '../../server/index';
import pool from '../../server/db/config';
import {
  seedData,
  emptyTablesPromise,
  populateUsersTablePromise,
  populateMenuTablePromise,
  populateOrdersTablePromise,
  generateValidToken,
} from '../seed/seed';

chai.use(chaiHttp);
chai.use(dirtyChai);

describe('GET /users/<userId>/orders', () => {
  beforeEach(async () => {
    await emptyTablesPromise;
    await populateMenuTablePromise;
    await populateUsersTablePromise;
    await populateOrdersTablePromise;
  });
  const { validUser, validUserTwo } = seedData.users;

  it('should successfully get all orders for specified user', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${validUser.id}/orders`)
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.should.have.all.keys(['status', 'message', 'orders']);
        res.body.orders.should.be.an('array');
        done();
      });
  });

  it('should return a 401 if user isn\'t authenticated', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${validUser.id}/orders`)
      .set('x-auth', '')
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(401);
        res.body.should.have.all.keys(['status', 'message']);
        res.body.status.should.eql('error');
        done();
      });
  });

  it('should only return orders placed by specified user', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${validUser.id}/orders`)
      .set('x-auth', generateValidToken(validUser))
      .end(async (err, res) => {
        if (err) done(err);

        try {
          const orderCount = (await pool.query('SELECT * FROM orders WHERE author=$1', [validUser.id])).rowCount;
          res.body.orders.length.should.eql(orderCount);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('should return a 403 if user tries to get orders not placed by them', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${validUserTwo.id}/orders`)
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        res.body.status.should.eql('error');
        done();
      });
  });

  it('should return a 400 if specified user id is not a number', (done) => {
    chai.request(app)
      .get('/api/v1/users/dontdothis/orders')
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.status.should.eql('error');
        res.body.message.should.eql('invalid user id');
        done();
      });
  });
});

describe('POST /orders', () => {
  beforeEach(async () => {
    await emptyTablesPromise;
    await populateMenuTablePromise;
    await populateUsersTablePromise;
  });

  const { validUser } = seedData.users;
  const validFoodId = Math.ceil(seedData.menu.length * Math.random());
  const invalidFoodId = validFoodId * 2;

  // TODO: test for successful order creation

  it('should not place order if provided food id doesn\'t exist', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: invalidFoodId })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.not.have.keys(['order']);
        res.body.status.should.eql('error');
        done();
      });
  });

  it('should respond with an error on provision of invalid data types', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: 'something weird', authorId: '??' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.not.have.keys(['order']);
        res.body.status.should.eql('error');
        done();
      });
  });
});

describe('GET /orders', () => {
  before(async () => {
    await emptyTablesPromise;
    await Promise.all([populateUsersTablePromise, populateMenuTablePromise]);
    await populateOrdersTablePromise;
  });

  const { admin, validUser } = seedData.users;
  it('should get all user order if requester is admin', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .set('x-auth', generateValidToken(admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.should.have.keys(['status', 'message', 'orders']);
        res.body.orders.should.be.an('array');
        done();
        // TODO: make more assertions
      });
  });

  it('should not get orders if user is not admin', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        res.body.status.should.eql('error');
        done();
      });
  });
});

describe('GET /orders/:id', () => {
  before(async () => {
    await emptyTablesPromise;
    await populateUsersTablePromise;
    await populateMenuTablePromise;
    await populateOrdersTablePromise;
  });

  it('should not get order if user is not an admin', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${1}`)
      .set('x-auth', generateValidToken(seedData.users.validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        done();
      });
  });

  it('should not get order if invalid order id is provided', (done) => {
    chai.request(app)
      .get('/api/v1/orders/somethingwrong')
      .set('x-auth', generateValidToken(seedData.users.admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        done();
      });
  });

  it('should return a 404 if order id doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/5')
      .set('x-auth', generateValidToken(seedData.users.admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(404);
        done();
      });
  });

  // TODO: test for successfully fetched order
});

describe('PUT /orders/:id', () => {
  it('should not allow non admin users update order status', (done) => {
    chai.request(app)
      .put('/api/v1/orders/1')
      .set('x-auth', generateValidToken(seedData.users.validUser))
      .send({ status: 'complete' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        done();
      });
  });

  it('should return a 400 if invalid order id is provided', (done) => {
    chai.request(app)
      .put('/api/v1/orders/invalidstuff')
      .set('x-auth', generateValidToken(seedData.users.admin))
      .send({ status: 'complete' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.status.should.eql('error');
        done();
      });
  });

  it('should not allow any text to be set as status', (done) => {
    chai.request(app)
      .put('/api/v1/orders/1')
      .set('x-auth', generateValidToken(seedData.users.admin))
      .send({ status: 'this is wrong' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.status.should.eql('error');
        res.body.message.should.eql('incorrect status type provided');
        done();
      });
  });

  // TODO: test for successfully updated order
});
