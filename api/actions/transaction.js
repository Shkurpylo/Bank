// import mongoose from 'mongoose';
import {
  Transaction
} from '../models';

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    console.log('starting Transaction');
    const transaction = new Transaction({
      sender: req.body.sender,
      receiver: req.body.receiver,
      amount: req.body.amount,
      date: new Date(),
    });
    console.log(transaction + '  done!');
    if (!transaction) {
      reject('err');
    }
    resolve(transaction.save());
  });
}

export function getIncomingTransactions(receiverId) {
  return new Promise((resolve, reject) => {
    if (!receiverId) {
      reject('err');
    }
    resolve(Transaction.find({
      receiver: receiverId
    }));
  });
}

export function getOutTransactions(senderId) {
  return new Promise((resolve, reject) => {
    if (!senderId) {
      reject('err');
    }
    resolve(Transaction.find({
      receiver: senderId
    }));
  });
}


// export function getCards(req) { // get
//   const ownerId = mongoose.Types.ObjectId("582d63704852674bcde44df1");
//   return new Promise((resolve, reject) => {
//     console.log('getCards from actions/cards');
//     setTimeout(() => {
//       let cards = req.session.cards;
//       if (!cards) {
//         req.session.cards = cards;
//         resolve(cards = User.findById(ownerId).distinct('cards'));
//       }
//       reject('err'); // todo if
//     }, 500);
//   });
// }
