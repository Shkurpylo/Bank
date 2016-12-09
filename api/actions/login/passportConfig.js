import passportLocal from 'passport-local';
import { User } from '../../models/user';

const LocalStrategy = passportLocal.Strategy;

export default function configPassport(passport) {
  passport.serializeUser((user, done) => {
    console.log('!!!IN SERIALIZE USER ' + JSON.stringify(user));
    const userSerialized = {};
    userSerialized._id = user._id;
    userSerialized.name = user.firstName;
    // const userSerialized = user._id;
    // const userSerialized = {
    //   name: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email,
    //   id: user._id
    // };
    done(null, userSerialized);
    return null;
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).then((user) => {
      done(null, user);
      return null;
    }).catch((err) => {
      done(err, user);
      return null;
    });
  });

  passport.use('local-login', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email: email }).then(user => {
        console.log('========> here is user:  ' + JSON.stringify(user));
        if (!user) {
          done(null, false);
          return null;
        }

        if (!user.validPassword(password)) {
          done(null, false);
          return null;
        }

        done(null, user);
        return null;
      }).catch(err => {
        done(err);
        return null;
      });
    }));
}
