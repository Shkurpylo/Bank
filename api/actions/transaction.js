import mongoose from 'mongoose';
import { Transaction, User } from '../models';
import { getCardByNumber } from './cards';
import util from 'util';

export function getTransactions(req) {
  const userId = req.session.passport.user;
  // const userId = req.body.id;
  // const cardId = '58445540d6149b1284a289a1';
  const body = req.body;
  const queryBuilder = [];

  if (body.cardID) {
    queryBuilder.push(util.format(' {$or: [{\'receiver.cardId\': \'%s\'}, {\'sender.cardId\': \'%s\'}]}', body.cardID,
      body.cardID));
  }
  if (body.direction) {
    if (body.direction === 'all') {
      queryBuilder.push(util.format('{$or: [{\'sender.userId\': \'%s\'}, {\'receiver.userId\': \'%s\'}]}', userId,
        userId));
    } else if (body.direction === 'receiver') {
      queryBuilder.push(util.format('\'receiver.userId\': \'%s\'', userId));
    } else if (body.direction === 'sender') {
      queryBuilder.push(util.format('\'sender.userId\': \'%s\'', userId));
    }
  }

  const queryCore = queryBuilder.join(', ');
  const query = util.format('{$and: [%s] }', queryCore);
  
  console.log(query);

  return new Promise((resolve, reject) => {
    Transaction.find(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

function getIncomingSum(receiverId) {
  const cardId = mongoose.Types.ObjectId(receiverId); // eslint-disable-line new-cap
  return new Promise((resolve, reject) => {
    Transaction.aggregate([{
      $match: { 'receiver.cardId': cardId }
    }, {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }]).then(result => {
      if (!result[0]) {
        resolve(0);
      } else {
        resolve(result[0].total);
      }
    }, err => reject(err));
  });
}

function getOutgoingSum(senderId) {
  const cardId = mongoose.Types.ObjectId(senderId); // eslint-disable-line new-cap
  return new Promise((resolve, reject) => {
    Transaction.aggregate([{
      $match: { 'sender.cardId': cardId }
    }, {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }]).then(result => {
      if (!result[0]) {
        resolve(0);
      } else {
        resolve(result[0].total);
      }
    }, err => reject(err));
  });
}

export function countBalance(card) {
  const cardId = mongoose.Types.ObjectId(card); // eslint-disable-line new-cap
  return new Promise((resolve, reject) => {
    Promise.all([getIncomingSum(cardId),
        getOutgoingSum(cardId)
      ])
      .then(result => {
        let balance = 0;
        balance += result[0];
        balance -= result[1];
        resolve(balance);
      }).catch(err => reject(err));
  });
}

// export function getBalances(req) {
//   const userId = mongoose.Types.ObjectId(req.body.id);
//   // const userId = req.session.passport.user;
//   return new Promise((resolve, reject) => {
//     User.findById(userId).distinct('cards', (err, cards) => {
//       if (err) reject(err);
//       let current = Promise.resolve();
//       Promise.all(cards.map((card) => {
//         current = current.then(() => {
//           return countBalance(card._id);
//         })
//         .then((result) => {
//           let cardObj = {};
//           cardObj = card;
//           cardObj.balance = result;
//           return (cardObj);
//         });
//         return current;
//       }))
//         .then(results => resolve(results));
//     });
//   });
// }

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user;
    const senderCardId = mongoose.Types.ObjectId(req.body.sender); // eslint-disable-line new-cap
    const receiverCardNumber = req.body.receiver;
    Promise.all([
        User.findById(ownerId).findOne({ 'cards._id': req.body.sender }),
        getCardByNumber(receiverCardNumber)
      ])
      .then(result => {
        const senderCard = result[0].cards.id(senderCardId);
        const receiverCard = result[1];
        const transaction = new Transaction({
          sender: {
            userId: senderCard.owner,
            cardId: senderCard._id,
            cardNumber: senderCard.number
          },
          receiver: {
            userId: receiverCard.owner,
            cardId: receiverCard._id,
            cardNumber: receiverCard.number
          },
          message: req.body.message,
          amount: req.body.amount,
          date: new Date(),
        });

        transaction.save((err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      }, err => reject(err));
  });
}

export function abstractPaymentTerminal(req) {
  const senderId = mongoose.Types.ObjectId('58402a9a1469cf12a51fe61c'); // eslint-disable-line new-cap
  const senderCardId = mongoose.Types.ObjectId('58402ac31469cf12a51fe61e'); // eslint-disable-line new-cap
  const senderCardNumber = 5519971203432454;
  return new Promise((resolve, reject) => {
    const cardId = mongoose.Types.ObjectId(req.body.cardId); // eslint-disable-line new-cap
    const extraMoney = req.body.amount;
    User.findOne({ 'cards._id': cardId })
      .then(user => {
        const card = user.cards.id(cardId);
        const transaction = new Transaction({
          message: 'from abstractPaymentTerminal',
          sender: {
            userId: senderId,
            cardId: senderCardId,
            cardNumber: senderCardNumber
          },
          receiver: {
            userId: card.owner,
            cardId: card._id,
            cardNumber: card.number
          },
          amount: extraMoney,
          date: new Date(),
        });
        transaction.save((saveErr, result) => {
          if (saveErr) reject(saveErr);
          if (result) {
            resolve('sacrifice accepted');
          }
        });
      })
      .catch(err => reject(err));
  });
}
