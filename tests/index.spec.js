import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../server';

chai.use(chaiHttp);

describe('GET /', () => {
  it('should have a status code of 200', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should have a non-empty response object', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.body.should.be.an('object');
        done();
      });
  });

  it('should have a message property', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.body.should.have.a.property('message').that.is.a('string');
        done();
      });
  });
});
