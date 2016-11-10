import mongoose from "mongoose";

import '../../models/User';

const User = mongoose.model('User');

export function createUser(data) {
  const user = new User({
    firstName : data.firstName,
    lastName  : data.lastName,
    eMail     : data.eMail,
    password  : data.password
  });
  return user.save();
}

export function findUserByMail(mail) {
  return User.find({eMail : mail})
}

export function deleteUser(id) {
  return User.findById(id).remove();
}

