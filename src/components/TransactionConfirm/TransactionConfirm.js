import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as transactionActions from 'redux/modules/transaction';
import * as cardsAction from 'redux/modules/cards';


@connect(state => ({
  cards: state.cards.cards,
  authUser: state.auth.user,
  transactionData: state.transaction.transactionData,
  confirmInfo: state.transaction.confirmInfo,
  loadingInfo: state.transaction.loadingInfo,
  sendingTransaction: state.transaction.sendingTransaction
}),
  dispatch => bindActionCreators({ ...transactionActions, ...cardsAction }, dispatch)
  // dispatch => bindActionCreators(transactionActions, dispatch)
)

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
    cancelTransaction: PropTypes.func,
    getCards: PropTypes.func,
  };
  render() {
    const {
      getCards,
      confirmInfo,
      authUser,
      transactionData,
      sendingTransaction,
      loadingInfo,
      newTransaction,
      cancelTransaction,
    } = this.props;

    const handleNewTransaction = (transaction) => {
      return newTransaction(transaction)
      .then(() => getCards());
    };

    const styles = require('./TransactionConfirm.scss');

    return (
      <div className="col-sm-10 col-md-offset-1"
            style={{paddingLeft: 0, paddingRight: 0}}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close"
                      onClick={()=>cancelTransaction()}
                      data-dismiss="modal"
                      aria-label="Close">
                      <span aria-hidden="true">&times;
                      </span>
                    </button>
                    <h4 className="modal-title">Confirm transaction</h4>
                  </div>
                  <div className="modal-body">
                   <div className="row">
                     <div className={styles.fromSide + ' col-md-4'}>
                       <p className={styles.leftSide}>From:</p>
                       <p>You, {authUser.name} {authUser.lastName}</p>
                       <p className={styles.leftSide}>Card:</p>
                       <p className={styles.sender}>{transactionData.sender.number}</p>

                     </div>
                     <div className={styles.arrow + ' col-md-4'}>
                     { sendingTransaction || loadingInfo ?
                     <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i>
                       :
                     <i className="fa fa-arrow-right fa-5x" aria-hidden="true"></i>
                     }
                     </div>

                     <div className={styles.toSide + ' col-md-4'}>
                       <p className={styles.leftSide}>To:</p>
                       <p>{confirmInfo.receiverName} {confirmInfo.receiverLastname}</p>
                       <p className={styles.leftSide}>Card:</p>
                       <p className={styles.receiver}>{transactionData.receiver}</p>
                     </div>
                   </div>
                  </div>
                  <div className="row">
                  </div>
                  <div className="modal-footer">
                     <div className={styles.amount + ' col-md-4 col-md-offset-4'}>
                     {transactionData.amount + ' $'}

                     </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-default"
                      data-dismiss="modal"
                      disabled={loadingInfo || sendingTransaction}
                      onClick={()=>cancelTransaction()}
                      >Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleNewTransaction(transactionData)}
                      disabled={loadingInfo || sendingTransaction}
                      >Send
                    </button>
                  </div>
                </div>
              </div>
          </div>
    );
  }
}
