import passportLocal from 'passport-local';
import { User } from '../../models/user';

const LocalStrategy = passportLocal.Strategy;

export default function configPassport(passport) {
  passport.serializeUser((user, done) => {
    const userSerialized = {};
    userSerialized._id = user._id;
    userSerialized.name = user.firstName;
    done(null, userSerialized);
    return null;
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).then((user) => {
      done(null, user);
      return null;
    }).catch((err) => {
      done(err);
      return null;
    });
  });

  passport.use('local-login', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email: email }).then(user => {
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
