import React, {Component} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { isLoaded, getTransactions as loadTransactions } from 'redux/modules/transaction';

@asyncConnect([{
  deferred: true,
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadTransactions());
    }
  }
}])
@connect(
  state => ({
    transactions: state.transaction.transaction,
    error: state.transaction.error,
    loaded: state.transaction.loaded,
  }), { })
export default class History extends Component {
  // static propTypes = {
  //   transactions: propTypes.array,
  // }
  render() {
    // const styles = require('./History.scss');
    const {
     // transactions
    } = this.props;
    return (
      <div className="container">
      <div>
        <Helmet title="transactions"/>
        <h1>History</h1>
      </div>

       </div>

    );
  }
}
