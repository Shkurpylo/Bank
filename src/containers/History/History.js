import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import DatePicker from 'react-bootstrap-date-picker';
import { initializeWithKey } from 'redux-form';
import * as transactionsActions from 'redux/modules/transaction';
import { isLoaded as isLoadedCards, getCards as loadCards } from 'redux/modules/cards';
import { isLoaded, getTransactions as loadTransactions } from 'redux/modules/transaction';
import { reduxForm } from 'redux-form';

// import 'react-datepicker/dist/react-datepicker.css';

const hideHumber = (number) => {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '........' + stringCartNumber.slice(-4);
};

const coloredAmount = (userId, receiver, sender) => {
  if (sender === receiver) {
    return 'gray';
  } else if (sender === userId) {
    return 'red';
  } else if (receiver === userId) {
    return 'green';
  }
};

const fixedAmount = (amount) => {
  return amount.toFixed(2);
};

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
      dispatch(loadTransactions());
    }
  }
}])
@connect(
  state => ({
    cards: state.cards.cards,
    loaded: state.cards.loaded,
    loading: state.cards.loading,
    loadingTransactions: state.transaction.loadingTransactions,
    transactions: state.transaction.transactions,
    error: state.transaction.error,
    getTransactions: state.transaction.getTransactions,
    user: state.auth.user
  }), {...transactionsActions, initializeWithKey })

@reduxForm({
  form: 'history',
  fields: ['cardID', 'direction', 'dateBefore', 'dateAfter'],
})
export default class History extends Component {
  static propTypes = {
    transactions: PropTypes.array,
    cards: PropTypes.array,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    values: PropTypes.object,
    handleSubmit: PropTypes.func,
    getTransactions: PropTypes.func,
    loading: PropTypes.bool,
    loadingTransactions: PropTypes.bool,
    user: PropTypes.object
  }


  render() {
    const styles = require('./History.scss');
    const {
      fields: { cardID, direction, dateBefore, dateAfter },
      values,
      transactions,
      cards,
      handleSubmit,
      getTransactions,
      loadingTransactions,
      user
    } = this.props;
    return (
      <div>
      <div className="container">
        <div>
          <Helmet title="History"/>
          <h1 className={styles.title}>History</h1>
        </div>
      <div className="col-md-2">

      <p><b>Choose direction:</b></p>

        <div className="row">
          <div className="col-md-12">
            <div className="row">
            </div>
            <div className="btn-group-vertical" data-toggle="buttons" aria-label="...">
               <label className={direction.value === 'from' ? 'btn btn-default active' : 'btn btn-default'}>
                <input type="radio" {...direction} value="from" name="options" id="option1" autoComplete="off"/>
                 Sended transactions
              </label>
             <label className={direction.value === 'all' ? 'btn btn-default active' : 'btn btn-default'}>
               <input type="radio" {...direction} value="all" name="options" id="option2" autoComplete="off"/>
                All transactions
             </label>
              <label className={direction.value === 'to' ? 'btn btn-default active' : 'btn btn-default'}>
                <input type="radio" {...direction} value="to" name="options" id="option3" autoComplete="off"/>
                 Received transactions
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
          <p></p>
          <p><b>Select period:</b></p>
            <div>

              <DatePicker {...dateBefore} placeholder="MM/DD/YYYY" dateForm="MM/DD/YYYY" id="dateBefore-datepicker" />

            </div>
            <div style={{marginTop: 15}}>
 <DatePicker {...dateAfter} placeholder="MM/DD/YYYY" dateForm="MM/DD/YYYY" id="example-dateAfter" />

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <p></p>
            <label htmlFor="cardSelector">For:</label>
            <select name="myCard" className="form-control" id="cardSelector" {...cardID}>
            <option>All cards</option>
            {cards.map(card => <option name={card.name} key={card._id} value={card._id} >
            {card.name + ',   ' + card.number + ', balance: ' + card.balance + '$'}</option>)}
            </select>
          </div>
        </div>
        <p></p>
        <p> Transactions found: <b>{transactions.length}</b></p>

        <div className="row">
          <button className="btn btn-success btn-lg" style={{marginLeft: 20, marginTop: 5}} onClick={handleSubmit(() => (getTransactions(values)))}>
             <i className="fa fa-filter"/> Apply filters
           </button>
        </div>
      </div>

          <div className={styles.history + ' col-md-10 panel panel-default'}>
            {loadingTransactions && <div className={styles.loadingDiv}>
            <i className={styles.loading + ' fa fa-refresh fa-spin fa-3x fa-fw'}></i> </div>
             || transactions && transactions.length &&
                <table className="table table-striped">
                  <thead>
                  <tr>
                    <th className={styles.calendarIco}></th>
                    <th className={styles.dateCol}>Date</th>
                    <th className={styles.messageCol}>Massage</th>
                    <th className={styles.senderCol}>Sender</th>
                    <th className={styles.arrow}> </th>
                    <th className={styles.receiverCol}>Receiver</th>
                    <th className={styles.amountCol}>Amount</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    transactions.map((transaction) =>
                      <tr key={transaction._id}>
                        <td className={styles.calendarIco}><i className="fa fa-calendar" aria-hidden="true"></i></td>
                        <td className={styles.date} >{dateFormat(transaction.date)}</td>
                        <td className={styles.message} >{transaction.message}</td>
                        <td className={styles.senderCard} >{hideHumber(transaction.sender.cardNumber)}</td>
                        <td className={styles.arrow} ><i className="fa fa-arrow-right" aria-hidden="true"></i></td>
                        <td className={styles.receiverCard} >{hideHumber(transaction.receiver.cardNumber)}</td>
                        <td className={styles[coloredAmount(user._id, transaction.receiver.userId, transaction.sender.userId)] } >{fixedAmount(transaction.amount)} $</td>
                      </tr>)
                  }
              </tbody>
            </table>
            || <div className={styles.loadingDiv}>
              <i className={styles.nomatch}>No result for your selectors</i> </div>
            }
          </div>

       </div>
     </div>

    );
  }
}
