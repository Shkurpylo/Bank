// import { expect } from 'chai';
// // import sinon from 'sinon';
// import mongoose from 'mongoose';
// // import mockgoose from 'mockgoose';
// import config from '../../../src/config';
// import util from 'util';
// import {
//   // getCards,
//   getCardById,
//   getCardByNumber,
//   getReceiverInfo,
//   addNewCard,
//   updateCard
// } from '../cards';

// const db = config.db;
// const mLab = util.format('mongodb://%s:%s@%s:%s/%s', db.user, db.password, db.host, db.port, db.name);

// beforeEach(function(done) {
//   if (mongoose.connection.db) return done();
//   mongoose.connect(mLab, done);
// });

// after(function(done) {
//   mongoose.connection.close(function() {
//     done();
//   });
// });

// describe('check cards actions', function() {
//   // it('get cards should return all active user cards', async() => {
//   //   const result = await getCards({ session: { passport: { user: { _id: '58554b515f67b510b966dc36' } } } });
//   //   expect(result).to.be.instanceof(Array);
//   //   expect(result.length).to.be.above(1);
//   // });

//   it('getCardById should return one card', async() => {
//     const result = await getCardById({
//       session: { passport: { user: { _id: '58554b515f67b510b966dc36' } } },
//       query: { id: '58554b595f67b510b966dc37' }
//     });
//     expect(result).to.be.instanceof(Object);
//     expect(result).to.have.property('balance');
//   });

//   it('getCardByNumber should return one card without balance', async() => {
//     const result = await getCardByNumber(5519977245584531);
//     expect(result).to.be.instanceof(Object);
//     expect(result).to.have.property('name');
//     expect(result).to.have.property('cvv');
//     expect(result).to.not.have.property('balance');
//   });

//   it('getReceiverInfo should return owners card full name', async() => {
//     const result = await getReceiverInfo({ query: { cardNumber: '5519977245584531' } });
//     expect(result).to.be.instanceof(Object);
//     expect(result).to.have.property('receiverName');
//     expect(result.receiverName).to.be.equals('customer');
//     expect(result).to.have.property('receiverLastname');
//     expect(result.receiverLastname).to.be.equals('test');
//   });

//   it('addNewCard should to add a auto-generated card', async() => {
//     const result = await addNewCard({
//       session: { passport: { user: { _id: '58554b515f67b510b966dc36' } } },
//       body: { cardName: '', cardType: 'VISA' }
//     });
//     expect(result).to.be.equals('card successfuly added');
//   });

//   it('updateCard should change cards name', async() => {
//     const result = await updateCard({
//       session: { passport: { user: { _id: '58554b515f67b510b966dc36' } } },
//       body: { name: 'newName' + Math.random() }
//     });
//     expect(result).to.be.equals('card updated');
//   });
// });
