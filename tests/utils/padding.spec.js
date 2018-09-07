import 'chai/register-should';
import padding from '../../server/utils/padding';

describe('Padding Function', () => {
  it('should return a padded number as string given a single digit', () => {
    padding(2).should.be.a('string').that.has.lengthOf(2);
  });

  it('should not pad numbers which are not single digits', () => {
    padding(200).should.be.eql('200');
    padding('01').should.be.eql('01');
  });

  it('should only pad numbers', () => {
    padding('Hey!').should.be.eql(-1);
    padding('22').should.be.eql('22');
    padding('1').should.be.eql('01');
  });
});
