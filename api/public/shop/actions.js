import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';
import { hideNumber } from './helpers';


export function getUserCards(req) {
  return new Promise((resolve, reject) => {
    const ownerId = req.body.id;
    User.findById(ownerId).distinct('cards', (err, array) => {
      if (err) reject(err);
      console.log(JSON.stringify(array));
      const cards = array.map(function(card) {
        const cardObj = {};
        cardObj._id = card._id;
        cardObj.name = card.name;
        cardObj.number = hideNumber(card.number);
        return cardObj;
      });
      resolve(cards);
    });
  });
}


export function getUserId(req) { // post
  const email = req.body.email;
  const password = req.body.password;
  return new Promise((resolve, reject) => {
    User.findOne({ 'email': email }, (err, user) => {
      console.log(JSON.stringify(user));
      if (!user) {
        reject('wrong email');
        return null;
      }
      if (typeof password !== 'string') reject('password must be string');
      if (!user.validPassword(password)) {
        reject('wrong pass');
        return null;
      }
      resolve(user._id);
      return null;
    });
  });
}

export function paymentOfBuying(req) {
  const receiverId = mongoose.Types.ObjectId('583627c13b8ce854fa11e21e'); // eslint-disable-line new-cap
  const receiverCardId = mongoose.Types.ObjectId('583f3fcecefa2b0db2b77d26'); // eslint-disable-line new-cap
  const receiverCardNumber = 4019975145166519;
  return new Promise((resolve, reject) => {
    User.findOne({ 'cards._id': req.body.id }, 'cards': { $elemMatch: { '_id': req.body.id } }, (err, user) => {
      const card = user.cards[0];
      const transaction = new Transaction({
        message: 'payment for shopping in TrueShop1997',
        sender: {
          userId: card.owner,
          cardId: req.body.id,
          cardNumber: card.number
        },
        receiver: {
          userId: receiverId,
          cardId: receiverCardId,
          cardNumber: receiverCardNumber
        },
        amount: req.body.amount,
        date: new Date(),
      });
      transaction.save((saveErr, result) => {
        if (saveErr) reject(saveErr);
        if (result) {
          resolve('payment success');
        }
      });
    });
  });
}
