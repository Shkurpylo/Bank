import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';
import { hideNumber, checkBalance } from './helpers';
// import { countBalance } from '../../actions';


export function getUserCards(req) {
  return new Promise((resolve, reject) => {
    const ownerId = req.body.id || reject('wrong request! ownerId is not defined');
    User.findById(ownerId).distinct('cards', (err, array) => {
      if (err) reject(err);
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
  return new Promise((resolve, reject) => {
    const email = req.body.email || reject('wrong request! \'email\' paramether is not define');
    const password = req.body.password + '' || reject('wrong request! \'password\' paramether is not define');
    User.findOne({ 'email': email }, (err, user) => {
      console.log(JSON.stringify(user));
      if (!user) {
        reject('wrong email');
        return null;
      }
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
  // move to dataBase own storess collection
  const receiverId = mongoose.Types.ObjectId('583627c13b8ce854fa11e21e'); // eslint-disable-line new-cap
  const receiverCardId = mongoose.Types.ObjectId('583f3fcecefa2b0db2b77d26'); // eslint-disable-line new-cap
  const receiverCardNumber = 4019975145166519;
  return new Promise((resolve, reject) => {
    const cardId = req.body.cardId || reject('wrong request, \'cardId\' is not defined');
    const amount = req.body.amount || reject('wrong request, \'amount\' is not defined');
    checkBalance(cardId)
      .then(balance => {
        if (balance < amount) {
          reject('insufficient funds');
          return null;
        }
        User.findOne({ 'cards._id': cardId })
          .then(user => {
            const card = user.cards.id(cardId);
            const transaction = new Transaction({
              message: 'payment for shopping in TrueShop1997',
              sender: {
                userId: card.owner,
                cardId: cardId,
                cardNumber: card.number
              },
              receiver: {
                userId: receiverId,
                cardId: receiverCardId,
                cardNumber: receiverCardNumber
              },
              amount: amount,
              date: new Date(),
            });
            return transaction.save();
          })
          .then(resolve('payment success'))
          .catch(err => reject(err));
      });
  });
}
