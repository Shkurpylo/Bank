import { User } from '../../models';

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({'email': email}, (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}
