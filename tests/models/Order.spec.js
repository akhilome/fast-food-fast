import chai from 'chai';
import 'chai/register-should';
import dirtyChai from 'dirty-chai';
import Order from '../../server/models/Order';
import todaysDate from '../../server/utils/date';

chai.use(dirtyChai);

describe('New order model', () => {
  const order = new Order(1, 'Kizito Akhilome', 'Egg & Bread');

  it('should return a non-empty object', () => {
    order.should.be.an('object').that.is.not.empty();
  });

  it('should contain all the necessary properties', () => {
    order.should.have.all.keys('id', 'author', 'title', 'status', 'date');
  });

  it('should contain the correct data', () => {
    order.id.should.be.a('number').that.is.equal(1);
    order.author.should.equal('Kizito Akhilome');
    order.title.should.equal('Egg & Bread');
    order.status.should.equal('pending');
    order.date.should.equals(todaysDate());
  });
});
