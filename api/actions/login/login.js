// import passport from 'passport';


// export default function login(req) {
//   const user = {
//     name: req.body.name,
//     password: req.body.password
//   };
//   req.session.user = user;
//   return Promise.resolve(user);
// }

export default function login(app, passport) {
  app.post('/login',
    passport.authenticate('local-login'),
    (req, res) => {
      console.log(`User ${req.user.name} logged in`);
      res.json({
        status: 'ok',
        user: req.user
      });
    }
  );
}
