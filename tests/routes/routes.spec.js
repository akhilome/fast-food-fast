import chai from 'chai';
import 'chai/register-should';
import dirtyChai from 'dirty-chai';
import chaiHttp from 'chai-http';
import app from '../../server/index';
import orders from '../../server/db/orders';

chai.use(chaiHttp);
chai.use(dirtyChai);

const id = {
  valid: Math.ceil(Math.random() * orders.length),
  invalid: null,
};

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

describe('PUT /api/v1/orders/<orderId>', () => {
  it('should respond with an error if no status is provided', (done) => {
    chai.request(app)
      .put(`/api/v1/orders/${id.valid}`)
      .send({ })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object').which.has.a.property('error');
        done();
      });
  });

  it('should respond with an error if no order with provided id exists', (done) => {
    chai.request(app)
      .put(`/api/v1/orders/${id.invalid}`)
      .send({
        status: 'done',
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.an('object').which.has.a.property('error');
        done();
      });
  });

  it('should update the order and return a success message and the updated order', (done) => {
    chai.request(app)
      .put(`/api/v1/orders/${id.valid}`)
      .send({
        status: 'completed',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object').with.all.keys('message', 'order');
        res.body.order.should.have.property('status');
        res.body.order.status.should.eql('completed');
        done();
      });
  });
});
