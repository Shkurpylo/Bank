import { User } from '../../models';

export default function isValidNumber(req) {
  return new Promise((resolve, reject) => {
    console.log('IN card validation function, body is:' + JSON.stringify(req.body));
    setTimeout(() => {
      const cardNumber = req.body.receiver;
      const errorMassage = {};
      User.findOne({ 'cards.number': cardNumber }, (err, user) => {
        if (err) {
          console.log('YEAH erro is here!');
          throw err;
        }
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
