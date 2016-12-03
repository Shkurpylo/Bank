export default function loadAuth(req) {
  // return Promise.resolve(req.user || null);
  if (!req.session.passport) return null;
  return Promise.resolve(req.session.passport.user || null);
}
