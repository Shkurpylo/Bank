import mongoose from 'mongoose';
import { Transaction } from '../../models';
import { User } from '../../models';


export function getUserCards() {
  return new Promise((resolve, reject) => {
    const ownerId = mongoose.Types.ObjectId('583c89cee9b0ff599bfda427'); // eslint-disable-line new-cap
    const cards = User.findById(ownerId).distinct('cards');
    // TODO: add balance check
    if (!cards) {
      reject('empty cards list');
    }
    resolve(cards);
  });
}

export function getUserId(req) { // post
  const email = req.body.email;
  const password = req.body.password;
  return new Promise((resolve, reject) => {
    User.findOne({ 'email': email }, (err, user) => {
      if (user === null) {
        reject('wrong email');
        return null;
      }
      if (!user.validPassword(password)) {
        reject('wrong pass');
        console.log(req.body.email + ' pass: ' + req.body.password);
        return null;
      }
      resolve(user._id);
      return null;
    });
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
