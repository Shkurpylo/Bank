import { User } from '../../models';

export default function isValid(req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const email = req.body.email;
      const errorMassage = {};
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err;
        if (user) {
          errorMassage.email = 'Email is occupied';
          errorMassage.status = 406;
          errorMassage.type = 'error';
          reject(errorMassage);
        } else {
          resolve();
        }
      });
    }, 500);
  });
}
