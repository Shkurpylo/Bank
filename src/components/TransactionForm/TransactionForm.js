import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import transactionValidation from './transactionValidation';
import * as transactionActions from 'redux/modules/transaction';

const hideHumber = (number) => {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '....' + stringCartNumber.slice(-4);
};

function asyncValidate(data, dispatch, { isValidNumber }) {
  if (!data.receiver) {
    return Promise.resolve({});
  }
  return isValidNumber(data);
}


@connect(state => ({
  cards: state.cards.cards,
  loaded: state.cards.loaded,
  loading: state.cards.loading,
  ...state.transactions
}),
  dispatch => bindActionCreators(transactionActions, dispatch)
)

@reduxForm({
  form: 'transaction',
  fields: ['sender', 'receiver', 'mess', 'amount'],
  validate: transactionValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class TransactionForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    newTransaction: PropTypes.func,
    values: PropTypes.object,
    saveError: PropTypes.object,
    cards: PropTypes.array,
    confirmButton: PropTypes.func
  };
  render() {
    const {
      fields: { sender, receiver, mess, amount },
      asyncValidating,
      resetForm,
      cards,
      values,
      handleSubmit,
      // newTransaction,
      confirmButton
    } = this.props;

    const styles = require('./TransactionForm.scss');

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
                       <label htmlFor="cardSelector">
                         Choose your card:
                       </label>
                       <select
                         name="myCard"
                         className="form-control"
                         id="cardSelector"
                         {...sender}>

                       <option selected disabled>
                         Your cards
                       </option>

                       {
                         cards.map(
                           card => <option
                             name={card.name}
                             key={card._id}
                             value={JSON.stringify(card)}>
                             {card.name + ',   ' + hideHumber(card.number) + ', balance: ' + card.balance + '$'}
                         </option>)
                      }
                       </select>
                       {sender.error && sender.touched ? <div className={styles.errorText + ' text-danger'}>{sender.error}</div> :
                       <div><p></p></div>}
                       <div className="input-group">
                       {asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
                         <label htmlFor="cardName">Input card number of recipient:</label>
                         <input type="text" className="col-xs-3 form-control"
                         id="cardName" placeholder="0000 0000 0000 0000" {...receiver} />
                       </div>
                       {receiver.error && receiver.touched ? <div className={styles.errorText + ' text-danger'}>{receiver.error}</div> :
                       <div><p></p></div>}
                       <div className="input-group">
                         <label htmlFor="message">Input message for transaction:</label>
                         <input type="text" className="form-control"
                         id="message" placeholder="purpose of payment" {...mess} />
                       </div>
                       {mess.error && mess.touched ? <div className={styles.errorText + ' text-danger'}>{mess.error}</div> :
                       <div><p></p></div>}
                       <label htmlFor="amount">Amount:</label>
                       <div className="input-group">
                         <input type="name" className="col-xs-3 form-control"
                         id="amount" placeholder="100.00" {...amount} />
                         <div className="input-group-addon">$</div>
                       </div>
                       {amount.error && amount.touched ? <div className={styles.errorText + ' text-danger'}>{amount.error}</div> :
                       <div><p></p></div>}
                        <div className="form-group" style={{paddingTop: 15}}>
                          <button className="btn btn-success"
                          onClick={handleSubmit(() => (confirmButton(values)))
                          }>
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
