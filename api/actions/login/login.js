export default function login(app, passport) {
  app.post('/login',
    passport.authenticate('local-login'),
    (req, res) => {
      console.log(`User ${req.user.firstName} logged in`);
      const authUser = {
        name: req.user.firstName,
        _id: req.user._id
      };
      res.json({
        status: 'ok',
        user: authUser
      });
    }
  );
}
