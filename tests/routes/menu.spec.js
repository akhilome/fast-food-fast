import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import dirtyChai from 'dirty-chai';

import app from '../../server/index';
import {
  seedData,
  emptyTablesPromise,
  populateUsersTablePromise,
  populateMenuTablePromise,
  generateValidToken,
} from '../seed/seed';

chai.use(chaiHttp);
chai.use(dirtyChai);

before(async () => {
  await emptyTablesPromise;
  await populateMenuTablePromise;
  await populateUsersTablePromise;
});

describe('GET /menu', () => {
  const { validUser } = seedData.users;

  it('should get menu successfully if user is logged in', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .set('x-auth', generateValidToken(validUser))
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(200);
        res.body.message.should.eql('menu fetched successfully');
        res.body.menu.should.be.an('array');
        done();
      });
  });

  it('should not get menu if user not logged in', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .set('x-auth', '')
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(401);
        res.body.status.should.eql('error');
        done();
      });
  });
});
