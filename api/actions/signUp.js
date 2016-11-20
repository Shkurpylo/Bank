import { User } from '../models';

export default function createNewUser(req) {
  console.log('addUser' + JSON.stringify(req.body));
  return new Promise((resolve, reject) => {
    // write to database
    // const user = new User(req.body);
    const user = new User({
      firstName: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.pass,
      cards: []
    });
    resolve(user.save());
    reject('very bad');
    console.log('addUser end');
  });
}
