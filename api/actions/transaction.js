import { Transaction, User } from '../models';

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    console.log('starting Transaction' + JSON.stringify(req.body.sender));
    console.log('req.sender: ' + req.body.sender);
    console.log('req.receiver: ' + req.body.receiver);
    const ownerId = req.session.passport.user;

    Promise.all([
      User.findById(ownerId).findOne({ 'cards._id': req.body.sender }),
      User.findById(ownerId).findOne({ 'cards._id': req.body.receiver }) // , (err, receiver) => {
    ])
    .then(result => {
      console.log('=====----->  result[0]' + JSON.stringify(result[0]));
      console.log('=====----->  result[1]' + JSON.stringify(result[1]));
      const senderCard = result[0];
      const receiverCard = result[1];

      const transaction = new Transaction({
        sender: {
          userId: senderCard.owner,
          cardId: senderCard.cardId,
          cardNumber: senderCard.cardNumber
        },
        receiver: {
          userId: receiverCard.owner,
          cardId: receiverCard.cardId,
          cardNumber: receiverCard.cardNumber
        },
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

// export function getTransactions() {
//   return new Promise((resolve, reject) => {
//     Transaction.find({}).then(result => {
//       resolve(result);
//     }, err => reject(err));
//   });
// }

export function getTransactions() {
  return new Promise((resolve, reject) => {
    Transaction.find({}, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export function getIncomingSum(receiverId) {
  return new Promise((resolve, reject) => {
    Transaction.aggregate([{
      $match: { receiver: receiverId }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
    ]).then(result => {
      if (!result[0]) {
        resolve(0);
      } else {
        resolve(result[0].total);
      }
    }, err => reject(err));
  });
}

export function getOutgoingSum(senderId) {
  return new Promise((resolve, reject) => {
    Transaction.aggregate([{
      $match: { sender: senderId }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
    ]).then(result => {
      if (!result[0]) {
        resolve(0);
      } else {
        resolve(result[0].total);
      }
    }, err => reject(err));
  });
}
