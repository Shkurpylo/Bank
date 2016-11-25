// import React, { Component, propTypes } from 'react';
// import { connect } from 'react-redux';
// import { asyncConnect } from 'redux-async-connect';
// import Helmet from 'react-helmet';
// import { initializeWithKey } from 'redux-form';
// import * as transactionsActions from 'redux/modules/transaction';
// import { isLoaded, getTransactions as loadTransactions } from 'redux/modules/transaction';

// @asyncConnect([{
//   deferred: true,
//   promise: ({ store: { dispatch, getState } }) => {
//     console.log('in asyncConnect');
//     if (!isLoaded(getState())) {
//       console.log('in if body');
//       return dispatch(loadTransactions());
//     }
//   }
// }])
// @connect(
//   state => ({
//     transactions: state.transaction.transactions,
//     error: state.transaction.error,
//     loaded: state.transaction.loaded,
//   }), {...transactionsActions, initializeWithKey})
// export default class History extends Component {
//   static propTypes = {
//     transactions: propTypes.array
//   }
//   render() {
//     const styles = require('./History.scss');
//     const {
//       transactions
//     } = this.props;
//     return (
//       <div className="container">
//       <div>
//         <Helmet title="transactions"/>
//         <h1>History</h1>
//       </div>
//       {transactions && transactions.length &&
//             <table className="table table-hover">
//               <thead>
//               <tr>
//                 <th className={styles.colorCol}>Date</th>
//                 <th className={styles.sprocketsCol}>Sender</th>
//                 <th className={styles.ownerCol}>Receiver</th>
//                 <th className={styles.buttonCol}>Amount</th>
//               </tr>
//               </thead>
//               <tbody>
//               {
//                 transactions.map((transaction) =>
//                   <tr key={transaction._id}>
//                     <td className={styles.buttonCol} >{transaction.date}</td>
//                     <td className={styles.idCol} >{transaction.sender}</td>
//                     <td className={styles.colorCol} >{transaction.receiver}</td>
//                     <td className={styles.ownerCol} >{transaction.amount}</td>
//                   </tr>)
//               }
//               </tbody>
//             </table> }

//        </div>

//     );
//   }
// }
