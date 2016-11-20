import React, {Component} from 'react';
// import Helmet from 'react-helmet';
// import {connect} from 'react-redux';
import {TransactionForm} from 'components';

export default class Transactions extends Component {

  render() {
    const styles = require('./Transactions.scss');
    return (
      <div className={styles.transaction + ' container'}>
        <h1>
          Transactions
        </h1>
          <div className="row">
            <TransactionForm/>
          </div>
          <div className="row">
          </div>
      </div>
    );
  }
}

