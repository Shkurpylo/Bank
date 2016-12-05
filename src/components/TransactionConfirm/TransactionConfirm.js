import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as transactionActions from 'redux/modules/transaction';


@connect(state => ({
  cards: state.cards.cards,
  authUser: state.auth.user,
  transactionData: state.transaction.transactionData,
  confirmInfo: state.transaction.confirmInfo
}),
  dispatch => bindActionCreators(transactionActions, dispatch)
)

// @reduxForm({
//   form: 'transaction',
//   fields: ['sender', 'receiver', 'amount'],
// })


export default class TransactionConfirm extends Component {

  static propTypes = {
    sendingTransaction: PropTypes.bool,
    loadingInfo: PropTypes.bool,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    newTransaction: PropTypes.func,
    transactionData: PropTypes.object,
    authUser: PropTypes.object,
    confirmInfo: PropTypes.object,
    cards: PropTypes.array,
    cancelTransaction: PropTypes.func
  };
  render() {
    const {
      // resetForm,
      confirmInfo,
      authUser,
      transactionData,
      sendingTransaction,
      loadingInfo,
      // handleSubmit,
      newTransaction,
      cancelTransaction
    } = this.props;

    const styles = require('./TransactionConfirm.scss');


    return (
      <div className="col-sm-10 col-md-offset-1"
            style={{paddingLeft: 0, paddingRight: 0}}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" onClick={()=>cancelTransaction()} data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Confirm transaction</h4>
                  </div>
                  <div className="modal-body">
                   <div className="row">
                     <div className="col-md-4">
                       <p>From</p>
                       <p>{authUser.name}</p>
                       <p>{authUser.lastName}</p>
                       <p>Card:</p>
                       <p>{transactionData.sender.number}</p>


                     </div>
                     <div className={styles.arrow + ' col-md-4'}>
                     { sendingTransaction || loadingInfo ?
                     <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i>
                       :
                     <i className="fa fa-arrow-right fa-5x" aria-hidden="true"></i>
                     }
                     </div>

                     <div className="col-md-4">
                       <p>To</p>
                       <p>{confirmInfo.receiverName}
                       {confirmInfo.receiverLastname}</p>
                       <p>Card:</p>
                       <p>{transactionData.receiver}</p>
                     </div>
                   </div>
                  </div>
                  <div className="row">
                  </div>
                  <div className="modal-footer">
                     <div className="col-md-4 col-md-offset-4">
                     {transactionData.amount + '$'}

                     </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => (newTransaction(transactionData))} >Send</button>
                  </div>
                </div>
              </div>
          </div>
    );
  }
}
