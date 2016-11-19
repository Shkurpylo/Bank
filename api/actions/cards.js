import mongoose from 'mongoose';
import {
  User,
  Card
} from '../models';
// import {getIncomingTransactions, getOutTransactions} from './transaction'


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

export function addNewCard(req) { // get
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId("582d63704852674bcde44df1"); // temporary
    console.log('starting addNewCard');
    getUserById(ownerId).then(data => {
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
      if (!user) {
        reject('err');
      }
      resolve(user.save());
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
//
// export function countBalance(cardId){
//   return new Promise ((resolve, reject) => {
//     const incomingList =  getIncomingTransactions(cardId);
//     const outList = getOutTransactions(cardId);
//   };
//
// }


function getUserById() {
  const ownerId = mongoose.Types.ObjectId("582d63704852674bcde44df1");
  return User.findById(ownerId);
}

function numberGenerator(type) {
  const visaId = 401997;
  const masterCardId = 551997;
  const cardId = Math.floor(Math.random() * (10000000000 - 999999999)) + 999999999;
  if (type === 'VISA') {
    return '' + visaId + cardId;
  }
  return '' + masterCardId + cardId;

  // TODO: add Luhn algorithm
}

function getPin() {
  return Math.floor(Math.random() * (10000 - 999)) + 999;
}

function getCVV() {
  return Math.floor(Math.random() * (1000 - 99)) + 99;
}

function getExplDate() {
  let now = new Date;
  return (new Date(now.getMonth(), now.getFullYear() + 3));
}