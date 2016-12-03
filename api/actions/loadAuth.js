export default function loadAuth(req) {
  if ('passport' in req.session) {
    return Promise.resolve(req.session.passport.user || null);
  }
  return Promise.resolve(req.user || null);
  // debugger;
  // if (typeof req.session.passport === 'undefined') return null;
  // return Promise.resolve(req.session.passport.user || null);
}
