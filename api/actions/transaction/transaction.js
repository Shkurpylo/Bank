import mongoose from 'mongoose';
import { Transaction, User } from '../../models';
import { getCardByNumber } from '../cards';

export function getTransactions(req) {
  const userId = req.session.passport.user._id;
  const body = req.body;
  let before = {};
  let after = {};
  let direction = [];
  let card = {};

  switch (body.direction) {
    case 'to':
      direction = [{ 'receiver.userId': userId }];
      card = { '$and': body.cardID ? [{ 'receiver.cardId': body.cardID }] : [{}] };
      break;
    case 'from':
      direction = [{ 'sender.userId': userId }];
      card = { '$and': body.cardID ? [{ 'sender.cardId': body.cardID }] : [{}] };
      break;
    default:
      direction = [{ 'receiver.userId': userId }, { 'sender.userId': userId }];
      card = {'$or': [
        body.cardID ? { 'receiver.cardId': body.cardID } : {},
        body.cardID ? { 'sender.cardId': body.cardID } : {}
      ]};
      break;
  }

  if (body.dateAfter) {
    after = new Date(body.dateAfter);
    after.setHours(24);
  } else {
    const date = new Date();
    after = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  if (body.dateBefore) {
    before = new Date(body.dateBefore);
    before.setHours(0);
  } else {
    const date = new Date();
    before = new Date(date.getFullYear(), date.getMonth(), 0);
  }

  /* beautify ignore:start */
  const query = {
    '$and': [{'$or': direction },
      body.cardID === 'All cards' ? {}
      : card,
      {
        date: {
          $gte: before,
          $lt: after }
      }]
  };
  /* beautify ignore:end */
  console.log('QUERY: ' + JSON.stringify(query));

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
      }).catch(err => reject(err.message));
  });
}

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user._id;
    const senderCardId = mongoose.Types.ObjectId(req.body.sender); // eslint-disable-line new-cap
    const receiverCardNumber = req.body.receiver;
    Promise.all([User.findById(ownerId).findOne({ 'cards._id': req.body.sender }),
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
