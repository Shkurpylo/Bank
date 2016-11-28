export default function login(app, passport) {
  app.post('/login',
    passport.authenticate('local-login'),
    (req, res) => {
      console.log(`User ${req.user.firstName} logged in`);
      const authUser = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      };
      res.json({
        status: 'ok',
        user: authUser
      });
    }
  );
}
