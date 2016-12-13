import { User } from '../../models';

export default function isValidNumber(req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cardNumber = req.body.card;
      const errorMassage = {};
      User.findOne({ 'cards.number': cardNumber }, (err, user) => {
        if (err) throw err;
        if (!user) {
          errorMassage.receiver = 'card is not valid';
          reject(errorMassage);
        } else {
          resolve();
        }
      });
    }, 500);
  });
}
