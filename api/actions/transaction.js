import mongoose from 'mongoose';
import { Transaction, User } from '../models';

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    console.log('starting Transaction' + JSON.stringify(req.body.sender));
    console.log('req.sender: ' + req.body.sender);
    console.log('req.receiver: ' + req.body.receiver);
    const ownerId = req.session.passport.user;

    Promise.all([User.findById(ownerId).findOne({ 'cards._id': req.body.sender }),
        User.findById(ownerId).findOne({ 'cards._id': req.body.receiver }) // , (err, receiver) => {
      ])
      .then(result => {
        console.log('=====----->  result[0]' + JSON.stringify(result[0]));
        console.log('=====----->  result[1]' + JSON.stringify(result[1]));
        const senderCard = result[0];
        const receiverCard = result[1];

        const transaction = new Transaction({
          sender: {
            userId: senderCard.owner,
            cardId: senderCard.cardId,
            cardNumber: senderCard.cardNumber
          },
          receiver: {
            userId: receiverCard.owner,
            cardId: receiverCard.cardId,
            cardNumber: receiverCard.cardNumber
          },
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

export function getTransactions() {
  return new Promise((resolve, reject) => {
    Transaction.find({}, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export function getIncomingSum(receiverId) {
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

export function getOutgoingSum(senderId) {
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
        console.log(result);
        let balance = 0;
        balance += result[0];
        balance -= result[1];
        console.log('balance in then: ' + balance);
        resolve(balance);
      }).catch(err => reject(err));
  });
}

export function getBalances(req) {
  const userId = mongoose.Types.ObjectId(req.body.id);
  // const userId = req.session.passport.user;
  return new Promise((resolve, reject) => {
    User.findById(userId).distinct('cards', (err, cards) => {
      if (err) reject(err);
      let current = Promise.resolve();
      Promise.all(cards.map((card) => {
        current = current.then(() => {
          return countBalance(card._id);
        })
        .then((result) => {
          const cardObj = {};
          cardObj._id = card._id;
          cardObj.balance = result;
          return (cardObj);
        });
        return current;
      }))
      .then(results => resolve(results));
    });
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
