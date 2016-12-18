import { expect } from 'chai';
// import sinon from 'sinon';
import mongoose from 'mongoose';
import config from '../../../src/config';
import util from 'util';
import {
  checkCustomerToken,
  getCustomerByToken,
  // addCustomer
} from '../customer';

beforeEach(function(done) {
  if (mongoose.connection.db) return done();
  const db = config.db;
  const mLab = util.format('mongodb://%s:%s@%s:%s/%s', db.user, db.password, db.host, db.port, db.name);
  mongoose.connect(mLab, done);
});

after(function(done) {
  mongoose.connection.close(function() {
    done();
  });
});

describe('check customer', function() {
  it('checkCustomerToken should return true if token exist', async() => {
    const result = await checkCustomerToken('test-token');
    expect(result).to.deep.equals(true);
  });
  it('checkCustomerToken should return false if token is wrong', async() => {
    const result = await checkCustomerToken('fake-token');
    expect(result).to.deep.equals(false);
  });

  it('getCustomerByToken should return customer object if token exist', async() => {
    const result = await getCustomerByToken('test-token');
    expect(result).to.be.instanceof(Object);
    expect(result).to.have.property('name');
    expect(result).to.have.property('uuid');
    expect(result).to.have.property('account');
    expect(result).to.have.property('cardId');
    expect(result).to.have.property('cardNumber');
  });

  // it('addCustomer should failed if some paramethers is not exist', async() => {
  //   // const mockReq = {
  //   //   name
  //   // }
  //   const result = await addCustomer('fake-token');
  //   expect(result).to.throw();
  // });
});

