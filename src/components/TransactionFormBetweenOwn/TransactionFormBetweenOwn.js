import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as transactionActions from 'redux/modules/transaction';

const hideHumber = (number) => {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '....' + stringCartNumber.slice(-4);
};

@connect(state => ({
  cards: state.cards.cards,
  loaded: state.cards.loaded,
  loading: state.cards.loading,
}),
  dispatch => bindActionCreators(transactionActions, dispatch)
)

@reduxForm({
  form: 'transaction',
  fields: ['sender', 'receiver', 'amount'],
})
export default class TransactionFormBetweenOwn extends Component {
  static propTypes = {
    cards: PropTypes.array,
    saveError: PropTypes.object,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    values: PropTypes.object,
    handleSubmit: PropTypes.func,
    newTransaction: PropTypes.func,
  };
  render() {
    const {
      fields: { sender, receiver, amount },
      handleSubmit,
      resetForm,
      cards,
      values,
      newTransaction
    } = this.props;
    console.log(cards);

    // const styles = require('./TransactionForm.scss');

    return (
      <div className="panel panel-success col-sm-5 col-md-offset-3"
            style={{paddingLeft: 0, paddingRight: 0}}>
            <div className="panel-heading clearfix">
            Fast Transaction Between Own Cards
            </div>
              <div className="col-sm-10 col-md-offset-1">
        <form >
          <div className="row">
              <div className="form-group">

                   <label htmlFor="receiverCardSelector">To card:</label>
                   <select name="mySenderCard" className="form-control"
                   id="receiverCardSelector" {...receiver}>
                   {cards.map(card => <option name={card.name} value={card._id} key={card._id}>
                   {card.name + ',   ' + hideHumber(card.number)}</option>)}
                   </select>

                   <label htmlFor="senderCardSelector">From card:</label>
                   <select name="meReceiverCard" className="form-control"
                   id="senderCardSelector" {...sender}>
                   {cards.map(card => <option name={card.name} value={card._id} key={card._id}>
                   {card.name + ',   ' + hideHumber(card.number)}</option>)}
                   </select>

                   <label htmlFor="amount">Amount:</label>
                   <div className="input-group">
                   <input type="name" className="col-xs-3 form-control"
                   id="amount" placeholder="100.00" {...amount} />
                   <div className="input-group-addon">$</div>
                   </div>
                  <div className="form-group" style={{paddingTop: 15}}>
                    <button className="btn btn-success"
                    onClick={handleSubmit(() => (newTransaction(values))
                    .then(resetForm))}>
                      <i className="fa fa-plus"/> Send
                    </button>
                    <button className="btn btn-warning"
                        onClick={resetForm} style={{marginLeft: 20}}>
                      <i className="fa fa-undo"/> Reset
                    </button>
                  </div>
                  </div>
              </div>
        </form>

            </div>
          </div>
    );
  }
}


// console.log('=>>>>' + JSON.stringify(values)).then
