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
export default class TransactionForm extends Component {
  static propTypes = {
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    newTransaction: PropTypes.func,
    values: PropTypes.object,
    saveError: PropTypes.object,
    cards: PropTypes.array,
  };
  render() {
    const {
      fields: { sender, receiver, amount },
      resetForm,
      cards
      // values,
      // newTransaction
    } = this.props;
    console.log(cards);

    // const styles = require('./TransactionForm.scss');


    return (
      <div className="panel panel-info col-sm-5 col-md-offset-3"
            style={{paddingLeft: 0, paddingRight: 0}}>
            <div className="panel-heading clearfix">
            Fast Transaction To Any Card
            </div>
              <div className="col-sm-10 col-md-offset-1">
        <form >
          <div className="row">
              <div className="form-group">
                   <label htmlFor="cardSelector">Choose your card:</label>
                   <select name="myCard" className="form-control" id="cardSelector" {...sender}>
                   {cards.map(card => <option name={card.name} key={card._id}>
                   {card.name + ',    ' + hideHumber(card.number)}</option>)}
                   </select>
                   <div className="input-group">
                   <label htmlFor="cardName">Input card number of recipient:</label>
                   <input type="name" className="col-xs-3 form-control"
                   id="cardName" placeholder="0000 0000 0000 0000" {...receiver} />
                   </div>

                   <label htmlFor="amount">Amount:</label>
                   <div className="input-group">
                   <input type="name" className="col-xs-3 form-control"
                   id="amount" placeholder="100.00" {...amount} />
                   <div className="input-group-addon">$</div>
                   </div>
                  <div className="form-group" style={{paddingTop: 15}}>
                    <button className="btn btn-success" >
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
