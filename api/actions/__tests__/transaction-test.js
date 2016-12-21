import { expect } from 'chai';
// import sinon from 'sinon';
import mongoose from 'mongoose';
// import mockgoose from 'mockgoose';
import config from '../../../src/config';
import util from 'util';
import {
  countBalance,
  getTransactions
} from '../transaction';

const db = config.db;
const mLab = util.format('mongodb://%s:%s@%s:%s/%s', db.user, db.password, db.host, db.port, db.name);

beforeEach(function(done) {
  if (mongoose.connection.db) return done();
  mongoose.connect(mLab, done);
});

after(function(done) {
  mongoose.connection.close(function() {
    done();
  });
});

describe('check count balance in transaction actions', function() {
  it('should return correct card balance', async() => {
                                  //     5856e1c33d873b0c54950a13
    const result = await countBalance('5856e1c33d873b0c54950a13');
    expect(result).to.be.a('number');
    expect(result).to.be.equals(555);
  });
});

// describe('check transaction filters', function() {
//   it('should return tranasctions of all cards if we dont set a card in query', async() => {
//                                   //     5856e1c33d873b0c54950a13
//     const result = await getTransactions('5856e1c33d873b0c54950a13');
//     expect(result).to.be.a('number');
//     expect(result).to.be.equals(555);
//   });
// });
