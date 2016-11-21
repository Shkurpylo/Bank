import React, { Component, PropTypes } from 'react';
// import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { TransactionForm } from 'components';
import { TransactionFormBetweenOwn } from 'components';
import { switchForms } from 'redux/modules/transaction';

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
}), {switchForms})

export default class Transactions extends Component {
  static propTypes = {
    cards: PropTypes.array,
    showOwnForm: PropTypes.bool,
    switchForms: PropTypes.func
  };

  render() {
    const styles = require('./Transactions.scss');
    const {showOwnForm, switchForms} = this.props;  // eslint-disable-line no-shadow
    return (
      <div className={styles.transaction + ' container'}>
        <h1>
          Transactions
        </h1>
<div className="row">
  <div className="col-sm-5 col-md-offset-3">
    <div className="btn-group btn-group-justified" style={{paddingBottom: 30}} role="group" aria-label="...">
      <div className="btn-group" role="group">
        <button
          className={showOwnForm ? 'btn btn-primary active' : 'btn btn-primary'}
          onClick={ () => switchForms(true) }>Between own cards</button>
      </div>
      <div className="btn-group" role="group">
        <button
          className={showOwnForm ? 'btn btn-primary' : 'btn btn-primary active'}
          onClick={ () => switchForms(false) }>To another card</button>
      </div>
    </div>
  </div>
</div>
<div className="row">
         {showOwnForm ?
            <TransactionFormBetweenOwn/> :
            <TransactionForm/>
         }
    </div>
   </div>
    );
  }
}
