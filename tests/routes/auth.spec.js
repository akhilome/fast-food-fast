import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import dirtyChai from 'dirty-chai';
import app from '../../server/index';
import { seedData, populateTables } from '../seed/seed';

chai.use(chaiHttp);
chai.use(dirtyChai);

describe('POST /auth/signup', () => {
  before(populateTables);

  it('should signup a valid user successfully', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.admin)
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(201);
        res.body.should.be.an('object').that.has.keys(['status', 'message', 'user']);
        res.body.status.should.eql('success');
        res.body.user.should.have.keys(['id', 'name', 'email']);
        res.body.user.name.should.eql(seedData.users.admin.name);
        res.body.user.email.should.eql(seedData.users.admin.email);
        done();
      });
  });

  it('should not signup a user with no name', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.invalidUserNoName)
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.have.keys(['status', 'message']);
        res.body.should.not.have.keys(['user']);
        done();
      });
  });

  it('should not signup a user with no email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.invalidUserNoEmail)
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.have.keys(['status', 'message']);
        res.body.should.not.have.keys(['user']);
        done();
      });
  });

  it('should not signup a user with no password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.invalidUserNoPass)
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(400);
        res.body.should.have.keys(['status', 'message']);
        res.body.should.not.have.keys(['user']);
        done();
      });
  });

  it('should not signup a user with missmatching passwords', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.invalidUserPassMissMatch)
      .end((err, res) => {
        if (err) done(err);
        res.status.should.eql(400);

        res.body.should.have.keys(['status', 'message']);
        res.body.should.not.have.keys(['user']);
        res.body.message.should.eql('provided passwords donot match');
        done();
      });
  });

  it('should not signup a user if email already exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(seedData.users.admin)
      .end((err, res) => {
        if (err) done(err);
        res.status.should.eql(400);
        res.body.status.should.eql('error');
        res.body.message.should.eql('a user with that email already exists');
        done();
      });
  });
});
