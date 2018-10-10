import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import app from '../../server/index';
import pool from '../../server/db/config';
import { users, generateValidToken } from '../seed/seed';

chai.use(chaiHttp);

describe('POST /orders', () => {
  const { validUser } = users;

  it('should successfuly place order for food', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: 1 })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(201);
        res.body.status.should.eql('success');
        res.body.order.should.be.an('object');
        res.body.order.should.have.keys(['id', 'author', 'title', 'date', 'status']);
        res.body.order.status.should.eql('new');
        done();
      });
  });

  it('should successfuly place order for food if food id is string', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: '1' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(201);
        res.body.status.should.eql('success');
        res.body.order.should.be.an('object');
        res.body.order.should.have.keys(['id', 'author', 'title', 'date', 'status']);
        res.body.order.status.should.eql('new');
        done();
      });
  });

  it('should not place order if provided food id doesn\'t exist', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: 2 })
      .end(async (err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.not.have.keys(['order']);
        res.body.status.should.eql('error');
        done();
      });
  });

  it('should respond with an error on provision of invalid data type', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('x-auth', generateValidToken(validUser))
      .send({ foodId: 'something weird' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.not.have.keys(['order']);
        res.body.status.should.eql('error');
        done();
      });
  });
});

describe('GET /users/<userId>/orders', () => {
  it('should successfully get all orders for specified user', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${users.validUser.id}/orders`)
      .set('x-auth', generateValidToken(users.validUser))
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
      .get(`/api/v1/users/${users.validUser.id}/orders`)
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
      .get(`/api/v1/users/${users.validUser.id}/orders`)
      .set('x-auth', generateValidToken(users.validUser))
      .end(async (err, res) => {
        if (err) done(err);

        try {
          const orderCount = (await pool.query('SELECT * FROM orders WHERE author=$1', [users.validUser.id])).rowCount;
          res.body.orders.length.should.eql(orderCount);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('should return a 403 if user tries to get orders not placed by them', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${users.validUserTwo.id}/orders`)
      .set('x-auth', generateValidToken(users.validUser))
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
      .set('x-auth', generateValidToken(users.validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.status.should.eql('error');
        res.body.message.should.eql('invalid user id');
        done();
      });
  });
});

describe('GET /orders', () => {
  const { admin, validUser } = users;
  it('should get all user orders if requester is admin', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .set('x-auth', generateValidToken(admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.should.have.keys(['status', 'message', 'orders']);
        res.body.orders.should.be.an('array');
        res.body.orders[0].should.be.an('object');
        done();
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
  it('should not get order if user is not an admin', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${1}`)
      .set('x-auth', generateValidToken(users.validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(403);
        done();
      });
  });

  it('should not get order if invalid order id is provided', (done) => {
    chai.request(app)
      .get('/api/v1/orders/somethingwrong')
      .set('x-auth', generateValidToken(users.admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        done();
      });
  });

  it('should return a 404 if order id doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/5')
      .set('x-auth', generateValidToken(users.admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(404);
        done();
      });
  });

  it('should successfully fetch the order from the database', (done) => {
    chai.request(app)
      .get('/api/v1/orders/1')
      .set('x-auth', generateValidToken(users.admin))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.should.have.keys(['status', 'message', 'order']);
        res.body.order.should.be.an('object');
        res.body.order.should.have.all.keys(['id', 'author', 'date', 'status', 'title']);
        done();
      });
  });
});

describe('PUT /orders/:id', () => {
  it('should not allow non admin users update order status', (done) => {
    chai.request(app)
      .put('/api/v1/orders/1')
      .set('x-auth', generateValidToken(users.validUser))
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
      .set('x-auth', generateValidToken(users.admin))
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
      .set('x-auth', generateValidToken(users.admin))
      .send({ status: 'this is wrong' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.status.should.eql('error');
        res.body.message.should.eql('incorrect status type provided');
        done();
      });
  });

  it('should successfully update the status of an order', (done) => {
    chai.request(app)
      .put('/api/v1/orders/1')
      .set('x-auth', generateValidToken(users.admin))
      .send({ status: 'complete' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.status.should.eql('success');
        res.body.order.should.have.property('status');
        res.body.order.status.should.eql('complete');
        done();
      });
  });

  it('should not update the status of a non-existent order', (done) => {
    chai.request(app)
      .put('/api/v1/orders/5')
      .set('x-auth', generateValidToken(users.admin))
      .send({ status: 'complete' })
      .end((err, res) => {
        if (err) done(err);

        res.status.should.be.eql(404);
        res.body.should.be.an('object').which.has.all.keys(['status', 'message']);
        res.body.should.not.have.keys('order');
        done();
      });
  });
});
