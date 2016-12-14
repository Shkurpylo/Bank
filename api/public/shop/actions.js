import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';
import { getCustomerByToken } from '../../actions/customer';
import { countBalance } from '../../actions';
import { hideNumber } from './helpers';


export function getUserCards(req) {
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId(req.body.id) // eslint-disable-line new-cap
    || reject('wrong request! ownerId is not defined');
    User.aggregate([
        { $match: { '_id': ownerId } },
        { $unwind: '$cards' },
        { $match: { 'cards.active': true } },
        { $project: { _id: 0, 'cards.name': 1, 'cards.number': 1, 'cards._id': 1 } },
    ])
      .then(cards => {
        let current = Promise.resolve();
        Promise.all(cards.map((elem) => {
          current = current
            .then(() => {
              return countBalance(elem.cards._id);
            })
            .then((result) => {
              const cardObj = {
                balance: result.toFixed(2),
                number: hideNumber(elem.cards.number),
                _id: elem.cards._id,
                name: elem.cards.name
              };
              return (cardObj);
            });
          return current;
        }))
      .then(results => resolve(results))
      .catch(err => reject(err));
      });
  });
}

export function getUserId(req) {
  return new Promise((resolve, reject) => {
    const email = req.body.email || reject('wrong request! \'email\' paramether is not define');
    const password = req.body.password + '' || reject('wrong request! \'password\' paramether is not define');
    User.findOne({ 'email': email }, (err, user) => {
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
  const token = req.headers.authorization.split(' ')[1];
  let receiverId = '';
  let receiverCardId = '';
  let receiverCardNumber = '';
  let receiverName = '';
  return new Promise((resolve, reject) => {
    const cardId = req.body.cardId || reject('wrong request, \'cardId\' is not defined');
    const amount = req.body.amount || reject('wrong request, \'amount\' is not defined');
    countBalance(cardId)
      .then(balance => {
        if (balance < amount) {
          reject('insufficient funds');
          throw new Error('insufficient funds');
        }
        return null;
      })
      .then(() => { return getCustomerByToken(token); })
      .then(customer => {
        receiverId = customer.account;
        receiverCardId = customer.cardId;
        receiverCardNumber = customer.cardNumber;
        receiverName = customer.name;
        return User.findOne({ 'cards._id': cardId });
      })
      .then(user => {
        const card = user.cards.id(cardId);
        const transaction = new Transaction({
          message: 'payment for shopping in ' + receiverName,
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
      .then(result => {
        if (result) resolve('payment success');
        reject('payment error');
      })
      .catch(err => reject(err));
  });
}


export function returnPayment(req) {
  const token = req.headers.authorization.split(' ')[1];
  let returnerId = '';
  let returnerCardId = '';
  let returnerCardNumber = '';
  let returnerName = '';
  return new Promise((resolve, reject) => {
    const cardId = req.body.cardId || reject('wrong request, \'cardId\' is not defined');
    const amount = req.body.amount || reject('wrong request, \'amount\' is not defined');
    countBalance(cardId)
      .then(balance => {
        if (balance < amount) {
          reject('you can\'t return this money, because you don\'t have enaugh money');
          throw new Error('insufficient funds');
        }
        return null;
      })
      .then(() => { return getCustomerByToken(token); })
      .then(customer => {
        returnerId = customer.account;
        returnerCardId = customer.cardId;
        returnerCardNumber = customer.cardNumber;
        returnerName = customer.name;
        return User.findOne({ 'cards._id': cardId });
      })
      .then(user => {
        const card = user.cards.id(cardId);
        const transaction = new Transaction({
          message: 'return of purchases in ' + returnerName,
          sender: {
            userId: returnerId,
            cardId: returnerCardId,
            cardNumber: returnerCardNumber
          },
          receiver: {
            userId: card.owner,
            cardId: cardId,
            cardNumber: card.number
          },
          amount: amount,
          date: new Date(),
        });
        return transaction.save();
      })
      .then(result => {
        if (result) resolve('returning success');
        reject('payment error');
      })
      .catch(err => reject(err));
  });
}
