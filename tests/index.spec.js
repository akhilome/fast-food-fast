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

describe('GET /unassigned', () => {
  it('should respond with a 404 and formatted json', (done) => {
    chai.request(app)
      .get('/someunhandledroute')
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(404);
        res.body.should.be.an('object');
        res.body.should.have.keys(['status', 'message']);
        res.body.message.should.eql('no route has been assigned to that URL');
        done();
      });
  });

  it('should provide a custom error reponse for POSTs too', (done) => {
    chai.request(app)
      .post('/nothingishere')
      .end((err, res) => {
        if (err) done(err);

        res.status.should.eql(404);
        res.body.should.be.an('object').which.has.keys(['status', 'message']);
        res.body.message.should.eql('no route has been assigned to that URL');
        done();
      });
  });
});
