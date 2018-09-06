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

describe('GET /api/v1/orders/', () => {
  const keys = ['id', 'author', 'title', 'status', 'date'];
  it('should respond with status 200', (done) => {
    chai.request(app)
      .get('/api/v1/orders/')
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });

  it('should return an object with an "orders" property which should be an array', (done) => {
    chai.request(app)
      .get('/api/v1/orders/')
      .end((err, res) => {
        res.body.should.be.an('object').which.has.a.property('orders');
        res.body.orders.should.be.an('array');
        done();
      });
  });

  it('should respond with an object having an array with correct data', (done) => {
    chai.request(app)
      .get('/api/v1/orders/')
      .end((err, res) => {
        res.body.orders[res.body.orders.length - 1].should.have.all.keys(keys);
        done();
      });
  });
});
