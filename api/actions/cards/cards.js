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
    reject('err'); // todo if
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
  const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1');
  return User.findById(ownerId);
}

export function addNewCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // temporary
    console.log('starting addNewCard');
    getUserById(ownerId)
      .then(data => {
        const newcard = new Card({
          number: numberGenerator(req.body.cardType),
          name: req.body.cardName,
          pin: getPin(),
          cvv: getCVV(),
          explDate: getExplDate(),
          owner: ownerId
        });
        const user = data;
        user.cards.push(newcard);
        console.log(newcard + '  is pushed and ready to save');
        resolve(user.save());
      }, err => {
        reject(err);
      });
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
        resolve({cardId: balance});
      },
        err => reject(err));
  });
}
