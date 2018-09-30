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

const keys = ['id', 'author', 'title', 'status', 'date'];

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

describe('GET /api/v1/orders/<orderId>', () => {
  it('should respond with status 200 if order is found', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${id.valid}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should respond with status 404 and an error message if order is not found', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${id.invalid}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object').that.has.property('error');
        done();
      });
  });

  it('should respond with an object having correct data', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${id.valid}`)
      .end((err, res) => {
        res.body.should.be.an('object').which.has.all.keys(keys);
        done();
      });
  });
});

describe('POST /api/v1/orders', () => {
  const completeData = { author: 'Kizito', title: 'Turkey' };
  const incompleteData = { author: 'Kizito' };

  it('should return a 400 error and a message if data is incomplete', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .send(incompleteData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object').which.has.a.property('error');
        done();
      });
  });

  it('should add the order to the database and respond with 201 if data is complete', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .send(completeData)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object').which.has.a.property('message');
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