// import mongoose from 'mongoose';
// import { getIncomingSum, getOutgoingSum } from '../../actions/transaction';

export function hideNumber(number) {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 2) + '...' + stringCartNumber.slice(-4);
}

// export function checkBalance(id) {
//   // const id = mongoose.Types.ObjectId(req.query.id); // eslint-disable-line new-cap
//   return new Promise((resolve, reject) => {
//     Promise.all([
//       getIncomingSum(id),
//       getOutgoingSum(id)
//     ])
//     .then(result => {
//       let balance = 0;
//       balance += result[0];
//       balance -= result[1];
//       resolve(balance);
//     })
//     .catch(err => reject(err));
//   });
// }
