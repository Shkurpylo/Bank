import mongoose from 'mongoose';
import { User, Card } from '../../models';
import { numberGenerator, getPin, getCVV, getExplDate } from './cardsHelpers';
import { getIncomingSum, getOutgoingSum } from '../transaction';


export function getCards(req) { // get
  const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1');
  return new Promise((resolve, reject) => {
    console.log('getCards from actions/cards');
    let cards = req.session.cards;
    if (!cards) {
      req.session.cards = cards;
      resolve(cards = User.findById(ownerId).distinct('cards'));
    }
    reject('err');
  });
}


export function getCardByNumber(req) { // get
  const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1');
  return new Promise((resolve, reject) => {
    const number = req.query.num;
    if (!number) {
      reject('err'); // todo if
    }
    resolve(User.findById(ownerId).findOne({ 'cards.number': number }));
  });
}

function getUserById() {
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1');
    if (!ownerId) {
      reject('user ID is not defined');
    }
    resolve(User.findById(ownerId));
  });
}

function createCard(ownerId, cardName, cardType) {
  return new Promise((resolve, reject) => {
    const newCard = new Card();
    newCard.owner = ownerId;
    if (!ownerId) {
      reject('smth wrong with id');
    }
    newCard.name = cardName ? cardName : 'default Name';
    newCard.number = numberGenerator(cardType);
    newCard.pin = getPin();
    newCard.cvv = getCVV();
    newCard.explDate = getExplDate();

    resolve(newCard);
  });
}

export function addNewCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // temporary
    console.log('starting addNewCard');
    Promise.all([
      getUserById(ownerId),
      createCard(ownerId, req.body.cardName, req.body.cardType)
    ]).then(result => {
      console.log(result);
      const user = result[0];
      const newCard = result[1];
      user.cards.push(newCard);
      user.save();
    },
      resolve('ok'),
      err => reject(err),
    );
  });
}



export function updateCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // temporary
    User.update({
      '_id': ownerId,
      'cards._id': req.body._id
    }, {
      '$set': {
        'cards.name': req.body.cardName
      }
    }, );
    resolve('ok');
    reject('err');
  });
}

export function deleteCard(req) { // get
  return new Promise((resolve, reject) => {
    console.log('=============>>>>>>' + req.query.id);
    const id = req.query.id;

    resolve(
      User.update({}, {
        '$pull': {
          cards: {
            '_id': id
          }
        }
      }, {
        multi: true
      }));
    if (false === true) {
      reject('err');
    }
  });
}

export function countBalance(req) {
  return new Promise((resolve, reject) => {
    const cardId = mongoose.Types.ObjectId(req.query.id); // eslint-disable-line new-cap
    let balance = 0;
    getIncomingSum(cardId)
      .then(result => {
        console.log('result first: ' + result);
        balance += result;
      });
    getOutgoingSum(cardId)
      .then(result => {
        console.log('resultSecond: ' + result);
        balance -= result;
        resolve({ cardId: balance });
      })
      .catch(err => reject(err));
  });
}
