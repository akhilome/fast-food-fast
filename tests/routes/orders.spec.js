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
  const { validUser } = seedData.users;

  it('should successfully get all orders for specified user', (done) => {
    chai.request(app)
      .get(`/users/${validUser.id}/orders`)
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
      .get(`/users/${validUser.id}/orders`)
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
      .get(`/users/${validUser.id}/orders`)
      .set('x-auth', generateValidToken(validUser))
      .end(async (err, res) => {
        if (err) done(err);

        const orderCount = (await pool.query('SELECT * FROM orders WHERE author=$1', [validUser.id])).rowCount;

        res.body.orders.length.should.eql(orderCount);
        done();
      });
  });
});
