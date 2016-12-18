import { expect } from 'chai';
// import sinon from 'sinon';
import {
  numberGenerator,
  getPin,
  getCVV,
  getExplDate,
  hideHumber
} from '../cards/cardsHelpers';

describe('check cardHelpers', function() {
  it('card number has length 16', function() {
    expect(numberGenerator()).to.have.lengthOf(16);
  });
  it('card number is an integer', function() {
    expect(numberGenerator() % 1).to.equal(0);
  });
  it('card VISA starts from 4', function() {
    expect(numberGenerator('VISA')[0]).to.equal('4');
  });
  it('card Mastercard starts from 5', function() {
    expect(numberGenerator('Mastercard')[0]).to.equal('5');
  });
  it('card number is an integer', function() {
    expect(numberGenerator() % 1).to.equal(0);
  });

  it('card pin length 4', function() {
    expect(getPin().toString()).to.have.lengthOf(4);
  });
  it('card pin is an integer', function() {
    expect(getPin() % 1).to.equal(0);
  });

  it('card cvv length 3', function() {
    expect(getCVV().toString()).to.have.lengthOf(3);
  });
  it('card CVV is an integer', function() {
    expect(getCVV() % 1).to.equal(0);
  });

  it('card duration of 3 years', function() {
    const now = new Date();
    expect(getExplDate().getFullYear() - now.getFullYear()).to.equal(3);
  });

  it('hiden number is a string', function() {
    expect(hideHumber(1111222233334444)).to.be.a('string');
  });
});
