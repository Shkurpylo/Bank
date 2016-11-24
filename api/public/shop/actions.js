import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';


export function getUserCards() {
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('582d63704852674bcde44df1'); // eslint-disable-line new-cap
    const cards = User.findById(ownerId).distinct('cards');
    // TODO: add balance check
    if (!cards) {
      reject('empty cards list');
    }
    resolve(cards);
  });
}

export function getUserId(req) { // post
  return new Promise((resolve, reject) => {
    const user = User.find({ 'email': req.body.email });
    // console.log(req.body.email);
    // if (!user) {
    //   reject('wrong email');
    // }
    // if (!user.password === req.body.password) {
    //   reject('wrong password');
    // }
    resolve(user._id);
    reject('wrong password');
  });
}

export function paymentOfBuying(req) {
  const staticReceiver = mongoose.Types.ObjectId('583627c13b8ce854fa11e21e'); // eslint-disable-line new-cap
  return new Promise((resolve, reject) => {
    const transaction = new Transaction({
      sender: req.body.sender,
      receiver: staticReceiver,
      amount: req.body.amount,
      date: new Date(),
    });
    const result = transaction.save();
    if (!result) {
      reject('err');
    }
    resolve('ok');
  });
}
