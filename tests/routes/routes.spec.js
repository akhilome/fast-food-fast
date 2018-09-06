import chai from 'chai';
import 'chai/register-should';
import dirtyChai from 'dirty-chai';
import chaiHttp from 'chai-http';
import app from '../../server/index';

chai.use(chaiHttp);
chai.use(dirtyChai);

describe('GET /api/v1/', () => {
  it('should respond with a 200 status code', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });

  it('should return an object with a message property', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.body.should.be.an('object').that.has.a.property('message').which.is.not.empty();
        done();
      });
  });
});
