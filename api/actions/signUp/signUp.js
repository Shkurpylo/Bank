import { User } from '../../models';

export default function createNewUser(req) {
  console.log('addUser' + JSON.stringify(req.body));
  return new Promise((resolve, reject) => {
    const user = new User({
      firstName: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.pass,
      cards: []
    });
    user.save((err, result) => {
      if (err) reject('user save fail');
      resolve(result);
    });
    console.log('addUser end');
  });
}
