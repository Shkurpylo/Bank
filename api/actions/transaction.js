import { Transaction } from '../models';

export function addTransaction(req) {
  return new Promise((resolve, reject) => {
    console.log('starting Transaction');
    const transaction = new Transaction({
      sender: req.body.sender,
      receiver: req.body.receiver,
      amount: req.body.amount,
      date: new Date(),
    });
    console.log(transaction + '  done!');
    if (!transaction) {
      reject('err');
    }
    resolve(transaction.save());
  });
}

export function getTransactions() {
  return new Promise((resolve, reject) =>
    Transaction.find({}).then(result => {
      resolve(result);
    }, err => reject(err))
  );
}

export function getIncomingSum(receiverId) {
  return new Promise((resolve, reject) => {
    Transaction.aggregate([{
      $match: { receiver: receiverId }},
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }]).then(result => {
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
      $match: { sender: senderId }},
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }]
    ).then(result => {
      if (!result[0]) {
        resolve(0);
      } else {
        resolve(result[0].total);
      }
    }, err => reject(err));
  });
}


