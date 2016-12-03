export default function logout(req) {
  return new Promise((resolve) => {
    req.logout();
    // req.session.destroy();
    resolve(null);
  });
}
