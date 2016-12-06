import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { initializeWithKey } from 'redux-form';
import * as transactionsActions from 'redux/modules/transaction';
import { isLoaded as isLoadedCards, getCards as loadCards } from 'redux/modules/cards';
import { isLoaded, getTransactions as loadTransactions } from 'redux/modules/transaction';
import { reduxForm } from 'redux-form';

const hideHumber = (number) => {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '....' + stringCartNumber.slice(-4);
};

// const coloredRows = (number) => {
//   if(number.toString()[0] == )
// }

const dateFormat = (date) => {
  const formatingDate = new Date(date);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return (formatingDate.toLocaleString('en-US', options));
};

@asyncConnect([{
  deferred: true,
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoadedCards(getState())) {
      dispatch(loadCards());
    }
    if (!isLoaded(getState())) {
      (dispatch(loadTransactions()));
    }
  }
}])
@connect(
  state => ({
    cards: state.cards.cards,
    loaded: state.cards.loaded,
    loading: state.cards.loading,
    transactions: state.transaction.transactions,
    error: state.transaction.error,
  }), {...transactionsActions, initializeWithKey })

@reduxForm({
  form: 'transaction',
  fields: ['cardID', 'direction', 'period'],
})
export default class History extends Component {
  static propTypes = {
    transactions: PropTypes.array,
    cards: PropTypes.array,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    values: PropTypes.object,
    handleSubmit: PropTypes.func,
  }
  render() {
    const styles = require('./History.scss');
    const {
      fields: { cardID},
      values,
      transactions,
      cards,
      handleSubmit,

    } = this.props;
    return (
      <div className="container">
      <div>
        <Helmet title="transactions"/>
        <h1>History</h1>
      </div>
       <div className="row">

        <div className="col-md-4 col-md-offset-4">
          <label htmlFor="cardSelector">For:</label>
          <select name="myCard" className="form-control" id="cardSelector" onChange={handleSubmit(() => (loadTransactions(values)))}>
          <option selected>All cards</option>
          {cards.map(card => <option name={card.name} key={card._id} value={card._id} {...cardID} >
          {card.name + ',   ' + hideHumber(card.number) + ', balance: ' + card.balance + '$'}</option>)}
          </select>
        </div>
       </div>


      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="row">
          </div>
          <div className="btn-group btn-group-justified" data-toggle="buttons" aria-label="...">
             <label className="btn btn-primary active">
              <input type="radio" name="options" id="option1" autoComplete="off"/> Sending
            </label>
           <label className="btn btn-primary">
             <input type="radio" name="options" id="option2" autoComplete="off"/> All
           </label>
            <label className="btn btn-primary">
              <input type="radio" name="options" id="option3" autoComplete="off"/> Radio 3
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
        <h3>date picker</h3>
        </div>
      </div>
      <div className="row">
      <div className="col-md-10 col-md-offset-1 panel panel-default">
    {transactions && transactions.length &&
            <table className="table table-hover">
              <thead>
              <tr>
                <th className={styles.colorCol}>Date</th>
                <th className={styles.colorCol}>Massage</th>
                <th className={styles.sprocketsCol}>Sender</th>
                <th className={styles.ownerCol}>Receiver</th>
                <th className={styles.buttonCol}>Amount</th>
              </tr>
              </thead>
              <tbody>
              {
                transactions.map((transaction) =>
                  <tr key={transaction._id}>
                    <td className={styles.buttonCol} >{dateFormat(transaction.date)}</td>
                    <td className={styles.colorCol} >{transaction.message}</td>
                    <td className={styles.idCol} >{transaction.sender.cardNumber}</td>
                    <td className={styles.colorCol} >{transaction.receiver.cardNumber}</td>
                    <td className={styles.ownerCol} >{transaction.amount}</td>
                  </tr>)
              }
              </tbody>
            </table> }
          </div>
          </div>

       </div>

    );
  }
}
