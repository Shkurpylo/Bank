import mongoose from 'mongoose';
import { User, Card } from '../../models';
import { numberGenerator, getPin, getCVV, getExplDate, hideHumber } from './cardsHelpers';
import { countBalance } from '../transaction';
import { getUserById } from '../user';


export function getCards(req) {
  const userId = mongoose.Types.ObjectId(req.session.passport.user._id); // eslint-disable-line new-cap
  return new Promise((resolve, reject) => {
    User.aggregate([
        { $match: { '_id': userId } },
        { $unwind: '$cards' },
        { $match: { 'cards.active': true } },
        { $project: {_id: 0, 'cards.name': 1, 'cards.number': 1, 'cards._id': 1}},
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
              number: hideHumber(elem.cards.number),
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


export function getCardById(req) { // get
  const userId = req.session.passport.user._id;
  return new Promise((resolve, reject) => {
    Promise.all([User.findById(userId),
        countBalance(req.query.id)
      ])
      .then(results => {
        const card = results[0].cards.id(req.query.id);
        const cardObj = {
          balance: results[1].toFixed(2),
          active: card.active,
          explDate: card.explDate,
          cvv: card.cvv,
          number: card.number,
          _id: card._id,
          name: card.name
        };
        card.balance = results[1].toFixed(2);
        resolve(cardObj);
      })
      .catch(err => reject(err));
  });
}

export function getCardByNumber(number) { // get
  return new Promise((resolve, reject) => {
    User.findOne({ 'cards.number': number }, { cards: { $elemMatch: { number: number } } })
      .then(user => {
        if (user.cards[0]) resolve(user.cards[0]);
      })
      .catch(err => reject(err));
  });
}

export function getReceiverInfo(req) {
  return new Promise((resolve, reject) => {
    const receiverCardNumber = req.query.cardNumber;
    User.findOne({ 'cards.number': receiverCardNumber })
      .then(user => {
        const receiverInfo = {
          receiverName: user.firstName,
          receiverLastname: user.lastName,
        };
        resolve(receiverInfo);
      })
      .catch(err => reject(err));
  });
}


function createCard(ownerId, cardName, cardType) {
  return new Promise((resolve, reject) => {
    if (!ownerId) {
      reject('smth wrong with id');
    }
    const newCard = new Card();
    newCard.owner = ownerId;
    newCard.name = cardName ? cardName : 'My ' + cardType;
    newCard.number = numberGenerator(cardType);
    newCard.pin = getPin();
    newCard.cvv = getCVV();
    newCard.explDate = getExplDate();

    resolve(newCard);
  });
}

export function addNewCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user._id;
    Promise.all([getUserById(ownerId),
        createCard(ownerId, req.body.cardName, req.body.cardType)
      ])
      .then(result => {
        const user = result[0];
        const newCard = result[1];
        user.cards.push(newCard);
        user.save();
      })
      .then(() => {
        resolve('card successfuly added');
      })
      .catch(err => reject(err));
  });
}


export function updateCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user._id;
    User.update({
      '_id': ownerId,
      'cards._id': req.body.id
    }, {
      '$set': {
        'cards.$.name': req.body.name
      }
    })
    .then(() => resolve('card updated'))
    .catch(() => reject('cannot update card'));
  });
}

export function deleteCard(req) { // get
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user._id;
    const id = req.query.id;
    User.update({
      '_id': ownerId,
      'cards._id': id
    }, {
      '$set': {
        'cards.$.active': false
      }
    }, (err, ok) => {
      if (err) {
        reject(err);
      }
      resolve(ok);
    });
  });
}

