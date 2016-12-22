import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { TransactionForm } from 'components';
import { TransactionFormBetweenOwn } from 'components';
import { TransactionConfirm } from 'components';
import { switchForms, confirmButton, alertSuccessShow } from 'redux/modules/transaction';

import { asyncConnect } from 'redux-async-connect';
import { isLoaded, getCards as loadCards } from 'redux/modules/cards';

@asyncConnect([{
  deferred: true,
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadCards());
    }
  }
}])
@connect(state => ({
  cards: state.cards.cards,
  ...state.transaction,
}), { switchForms, confirmButton, loadCards, alertSuccessShow})

export default class Transactions extends Component {
  static propTypes = {
    cards: PropTypes.array,
    showOwnForm: PropTypes.bool,
    showConfirmWindow: PropTypes.bool,
    switchForms: PropTypes.func,
    alertSuccessHide: PropTypes.func,
    alertSuccessShow: PropTypes.func
  };

  render() {
    const styles = require('./Transactions.scss');
    const { showOwnForm, showConfirmWindow } = this.props; // eslint-disable-line no-shadow
    return (
      <div className={styles.transaction + ' container'}>
      <Helmet title="Transaction"/>
      <div className={styles.title + ' col-sm-3'}>
        <h1>
          Transactions
        </h1>
      </div>
      <div className="col-sm-5">
      </div>
        { showConfirmWindow ?
          <div>
          <TransactionConfirm
          />
          </div> :
        <div>
        <div className="row">
          <div className="col-sm-5 col-md-offset-3">

          </div>
        </div>
        <div className="row">
         {showOwnForm ?
            <TransactionFormBetweenOwn/> :
            <TransactionForm
            />
         }
    </div>
    </div>
        }
   </div>
    );
  }
}
