import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';
import { getCustomerByToken } from '../../actions/customer';
import { countBalance } from '../../actions';
import { hideNumber } from './helpers';


export function getUserCards(req) {
  return new Promise((resolve, reject) => {
    /* validate of request data  */
    const ownerIdString = req.body.id
      || reject({ body: 'wrong request! ownerId is not defined', status: 400 });
    const ownerId = mongoose.Types.ObjectId(ownerIdString); // eslint-disable-line new-cap
    /* aggregate user cards and return in array  */
    User.aggregate([
        { $match: { '_id': ownerId } },
        { $unwind: '$cards' },
        { $match: { 'cards.active': true } },
        { $project: { _id: 0, 'cards.name': 1, 'cards.number': 1, 'cards._id': 1 } },
    ])
    /* attach balance to each card */
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
    /* validate of request data  */
    const email = req.body.email
      || reject({ body: 'wrong request! \'email\' paramether is not define', status: 400 });
    const password = req.body.password + ''
      || reject({ body: 'wrong request! \'password\' paramether is not define', status: 400 });
    User.findOne({ 'email': email })
      .then(user => {
        if (!user) {
          reject('wrong email');
        }
        if (!user.validPassword(password)) {
          reject('wrong pass');
        }
        resolve(user._id);
      })
      .catch(err => reject(err));
  });
}


export function paymentOfBuying(req) {
  /* get user token for searching him data in future */
  const token = req.headers.authorization.split(' ')[1];

  let receiverId = '';
  let receiverCardId = '';
  let receiverCardNumber = '';
  let receiverName = '';

  return new Promise((resolve, reject) => {
    /* validate of request data */
    const cardId = req.body.cardId
      || reject({ body: 'wrong request, \'cardId\' is not defined', status: 400 });
    const amount = req.body.amount
      || reject({ body: 'wrong request, \'amount\' is not defined', status: 400 });
    /* check if balance is enough */
    countBalance(cardId)
      .then(balance => {
        if (balance < amount) {
          reject({ body: 'insufficient funds', status: 403 });
          throw new Error('insufficient funds');
        }
      })
      .then(() => { return getCustomerByToken(token); })
      .then(customer => {
        receiverId = customer.account;
        receiverCardId = customer.cardId;
        receiverCardNumber = customer.cardNumber;
        receiverName = customer.name;
        return User.findOne({ 'cards._id': cardId });
      })
     /* modeling transaction body */
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
        transaction.save();
      })
      .then(() => resolve('payment success'))
      .catch(err => reject(err));
  });
}


export function returnPayment(req) {
  /* validate of request data */
  const token = req.headers.authorization.split(' ')[1];

  let returnerId = '';
  let returnerCardId = '';
  let returnerCardNumber = '';
  let returnerName = '';
  return new Promise((resolve, reject) => {
    /* validate of request data */
    const cardId = req.body.cardId
      || reject({ body: 'wrong request, \'cardId\' is not defined', status: 400 });
    const amount = req.body.amount
      || reject({ body: 'wrong request, \'amount\' is not defined', status: 400 });
    /* check if balance is enough */
    countBalance(cardId)
      .then(balance => {
        if (balance < amount) {
          reject({
            body: 'you can\'t return this money, because you don\'t have enaugh money',
            status: 403
          });
          throw new Error('insufficient funds');
        }
        return null;
      })
      .then(() => {
        return getCustomerByToken(token);
      })
      .then(customer => {
        returnerId = customer.account;
        returnerCardId = customer.cardId;
        returnerCardNumber = customer.cardNumber;
        returnerName = customer.name;
        return User.findOne({ 'cards._id': cardId });
      })
      /* modeling transaction body */
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
        transaction.save();
      })
      .then(() => resolve('returning success'))
      .catch(err => reject(err));
  });
}
