import chai from 'chai';
import 'chai/register-should';
import dirtyChai from 'dirty-chai';
import makeTodaysDate from '../../server/utils/date';
import padding from '../../server/utils/padding';

chai.use(dirtyChai);

describe('Today\'s Date Utility Function', () => {
  it('should be a function', () => {
    makeTodaysDate.should.be.a('function');
  });

  it('should return a non-empty string', () => {
    makeTodaysDate().should.be.a('string').which.is.not.empty();
  });

  it('should return today\'s date', () => {
    const today = new Date(Date.now());
    makeTodaysDate().should.be.a('string').that.has.a.lengthOf('YYYY-MM-DD'.length);
    makeTodaysDate().should.be.a('string').which.includes(padding(today.getDate()));
    makeTodaysDate().should.be.a('string').which.includes(padding(today.getMonth() + 1));
    makeTodaysDate().should.be.a('string').which.includes(today.getFullYear());
  });
});
