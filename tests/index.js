import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

chai.use(chaiHttp);
chai.should();

describe('Default Route', () => {
  it('should have 200 status code', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
