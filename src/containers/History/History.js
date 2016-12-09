import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { initializeWithKey } from 'redux-form';
import * as transactionsActions from 'redux/modules/transaction';
import { isLoaded as isLoadedCards, getCards as loadCards } from 'redux/modules/cards';
import { isLoaded, getTransactions as loadTransactions } from 'redux/modules/transaction';
import { reduxForm } from 'redux-form';
import DatePicker from 'react-bootstrap-date-picker';

const hideHumber = (number) => {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '....' + stringCartNumber.slice(-4);
};


// const coloredTable = (id) => {
//   if (id === user._id) {
//     return true;
//   }
//   return false;
// };

// const getDefValueAfterDate = () => {
//   const date = new Date();
//   const firstDay = new Date(date.getFullYear(), date.getMonth(), 0);
//   return firstDay;
// };

// const getDefValueBeforeDate = () => {
//   const date = new Date();
//   const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   return lastDay;
// };

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
    user: PropTypes.object
  }


  render() {
    const styles = require('./History.scss');
    const {
      fields: { cardID, direction, dateBefore, dateAfter },
      values,
      resetForm,
      transactions,
      cards,
      handleSubmit,
      getTransactions,
      loading,
      user
    } = this.props;
    return (
      <div>
      <div className="container">
        <div>
          <Helmet title="traansactions"/>
          <h1>History</h1>
        </div>

      <div className="col-md-2">
      <p>Choose direction</p>

        <div className="row">
          <div className="col-md-12">
            <div className="row">
            </div>
            <div className="btn-group-vertical" data-toggle="buttons" aria-label="...">
               <label className={direction.value === 'from' ? 'btn btn-default active' : 'btn btn-default'}>
                <input type="radio" {...direction} value="from" name="options" id="option1" autoComplete="off"/> Sended
              </label>
             <label className={direction.value === 'all' ? 'btn btn-default active' : 'btn btn-default'}>
               <input type="radio" {...direction} value="all" name="options" id="option2" autoComplete="off"/> All
             </label>
              <label className={direction.value === 'to' ? 'btn btn-default active' : 'btn btn-default'}>
                <input type="radio" {...direction} value="to" name="options" id="option3" autoComplete="off"/> Received
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
          <p>Select period</p>
            <div>
              <DatePicker {...dateBefore} dateForm="MM/DD/YYYY" id="dateBefore-datepicker" />
            </div>
            <div style={{marginTop: 15}}>
              <DatePicker {...dateAfter} dateForm="MM/DD/YYYY" id="example-dateAfter" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <label htmlFor="cardSelector">For:</label>
            <select name="myCard" className="form-control" id="cardSelector" {...cardID}>
            <option>All cards</option>
            {cards.map(card => <option name={card.name} key={card._id} value={card._id} >
            {card.name + ',   ' + hideHumber(card.number) + ', balance: ' + card.balance + '$'}</option>)}
            </select>
          </div>
        </div>

        <div className="row">
          <button className="btn btn-success" onClick={handleSubmit(() => (getTransactions(values)))}>
             <i className="fa fa-paper-plane"/> Submit
           </button>
           <button className="btn btn-warning" onClick={resetForm} style={{marginLeft: 15}}>
             <i className="fa fa-undo"/> Reset
           </button>
        </div>
      </div>

          <div className="col-md-10 panel panel-default">
            {loading && <div className={styles.loadingDiv}>
            <i className={styles.loading + ' fa fa-refresh fa-spin fa-3x fa-fw'}></i> </div> ||
              transactions && transactions.length &&
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
                        <td className={styles.date} >{dateFormat(transaction.date)}</td>
                        <td className={styles.message} >{transaction.message}</td>
                        <td className={styles.senderCard} >{transaction.sender.cardNumber}</td>
                        <td className={styles.receiverCard} >{transaction.receiver.cardNumber}</td>
                        <td className={ transaction.receiver.userId === user._id ? styles.green : styles.red } >{transaction.amount}</td>
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
