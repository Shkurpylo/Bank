// import mongoose from 'mongoose';
import { User, Card } from '../../models';
import { numberGenerator, getPin, getCVV, getExplDate } from './cardsHelpers';
import { countBalance } from '../transaction';


function getUserById(id) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

// export function getCards(req) { // get
//   // const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1');
//   const ownerId = req.session.passport.user;
//   return new Promise((resolve, reject) => {
//     // const cards = req.session.cards;
//     // if (!cards) {
//     //   req.session.cards = cards;
//     User.findById(ownerId).distinct('cards', (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(result);
//     });
//     // }
//   });
// }

export function getCards(req) {
  // const userId = mongoose.Types.ObjectId(req.body.id);
  const userId = req.session.passport.user;
  return new Promise((resolve, reject) => {
    User.findById(userId).distinct('cards', (err, cards) => {
      if (err) reject(err);
      let current = Promise.resolve();
      Promise.all(cards.map((card) => {
          current = current
            .then(() => {
              return countBalance(card._id);
            })
            .then((result) => {
              let cardObj = {};
              cardObj = card;
              cardObj.balance = result.toFixed(2);
              return (cardObj);
            });
          return current;
        }))
        .then(results => resolve(results));
    });
  });
}


// export function getCardByNumber(req) { // get
//   return new Promise((resolve, reject) => {
//     const number = req.query.num;
//     User.findOne({ 'cards.number': number })
//       .then(user => {
//         user.cards.filter(card => {
//           if (card.number == number) resolve(card);
//         });
//       })
//       .catch(err => reject(err));
//   });
// }


export function getCardByNumber(number) { // get
  return new Promise((resolve, reject) => {
    console.log('in getCardById');
    // const number = req.query.num;
    User.findOne({ 'cards.number': number }, { cards: { $elemMatch: { number: number } } })
      .then(user => {
        console.log(user);
        if (user.cards[0]) resolve(user.cards[0]);
      })
      .catch(err => reject(err));
  });
}

// db.parents.find(
//     {'children.age': {$gte: 18}},
//     {children:{$elemMatch:{age: {$gte: 18}}}})


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
    // const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // temporary
    const ownerId = req.session.passport.user;
    console.log('starting addNewCard');
    Promise.all([getUserById(ownerId),
        createCard(ownerId, req.body.cardName, req.body.cardType)
      ])
      .then(result => {
        console.log(result);
        const user = result[0];
        const newCard = result[1];
        user.cards.push(newCard);
        // user.save();
        resolve(user.save());
      })
      .catch(err => reject(err));
  });
}


export function updateCard(req) { // post
  return new Promise((resolve, reject) => {
    const ownerId = req.session.passport.user;
    // const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // temporary
    User.update({
      '_id': ownerId,
      'cards._id': req.body._id
    }, {
      '$set': {
        'cards.name': req.body.cardName
      }
    }, (err, ok) => {
      if (err) {
        reject(err);
      }
      resolve(ok);
    });
  });
}

export function deleteCard(req) { // get
  return new Promise((resolve, reject) => {
    const id = req.query.id;
    User.update({}, {
      '$pull': {
        cards: {
          '_id': id
        }
      }
    }, {
      multi: true
    }, (err, ok) => {
      if (err) {
        reject(err);
      }
      resolve(ok);
    });
  });
}

// export function countBalance(req) {
//   return new Promise((resolve, reject) => {
//     const cardId = mongoose.Types.ObjectId(req.query.id); // eslint-disable-line new-cap
//     let balance = 0;
//     getIncomingSum(cardId)
//       .then(result => {
//         console.log('result first: ' + result);
//         balance += result;
//       });
//     getOutgoingSum(cardId)
//       .then(result => {
//         console.log('resultSecond: ' + result);
//         balance -= result;
//         resolve({ cardId: balance });
//       })
//       .catch(err => reject(err));
//   });
// }
