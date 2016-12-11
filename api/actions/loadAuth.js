export default function loadAuth(req) {
  if ('passport' in req.session) {
    return Promise.resolve(req.session.passport.user || null);
  }
  return null;
  // return Promise.resolve(req.user || null);
}
