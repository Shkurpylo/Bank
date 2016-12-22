import { User } from '../../models';

export default function createNewUser(req) {
  return new Promise((resolve, reject) => {
    const lowCaseEmail = req.body.email.toLowerCase();
    const user = new User({
      firstName: req.body.name,
      lastName: req.body.lastName,
      email: lowCaseEmail,
      password: req.body.pass,
      cards: []
    });
    user.save((err, result) => {
      if (err) reject('user save fail');
      req.login(result, (errLogin) => {
        if (errLogin) {
          console.log(errLogin);
        }
      });
      const newUser = {
        name: result.firstName,
        _id: result._id
      };
      resolve({'user': newUser});
    });
  });
}
