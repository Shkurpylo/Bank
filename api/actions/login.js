// import mongoose from "mongoose";
//
// import '../models/User';
//
// const User = mongoose.model('User');

export default function login(req) {
  const user = {
    name: req.body.name,
    password: req.body.password
  };
  req.session.user = user;
  return Promise.resolve(user);
}


// function seedWidgets() {
//   let results = [];
//   return new Promise((resolve, reject) => {
//     Widget.find({}, (err, collection) => {
//       if (collection.length === 0) {
//         initialWidgets.map(widget => {
//           Widget.create(widget);
//           results.push(widget);
//         });
//       }
//       if (err) reject(err);
//       else resolve(results);
//     })
//   });
// }
//
// export function loading() {
//   return new Promise((resolve, reject) => {
//     resolve(getWidgets());
//   });
// }
// export function getWidgets() {
//   return new Promise((resolve, reject) => {
//     seedWidgets().then((result) => {
//       Widget.find({}).then((result) => {
//         resolve(result);
//       })
//     }).catch((err) => {
//       reject(err);
//     })
//   });
// }
