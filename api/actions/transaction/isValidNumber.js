import { User } from '../../models';


export default function isValidNumber(req) {
  return new Promise((resolve, reject) => {
    const cardNumber = req.body.receiver;
    const errorMassage = {};
    User.findOne({cards: {$elemMatch: {number: cardNumber, active: true}}})
      .then(user => {
        if (!user) {
          errorMassage.receiver = 'card is not active';
          errorMassage.status = 200;
          errorMassage.type = 'error';
          reject(errorMassage);
        }
        resolve();
      }).catch(err => reject(err));
  });
}
