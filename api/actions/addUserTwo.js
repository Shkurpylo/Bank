import mongoose from 'mongoose';
import {User} from '../models';

export default function addUserTwo(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      //const user = new User(req.body);
      const user = new User({
        firstName: req.body.name,
        lastName: req.body.lastName,
        eMail: req.body.email,
        password: req.body.pass,
        cards: []
      });
      user.save();
      resolve('alright');
      reject('very bad');
      console.log('addUser end');
    }, 1500); // simulate async db write
  });
}

