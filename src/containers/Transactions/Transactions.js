import React, {Component} from 'react';

export default class Widgets extends Component {

  render() {
    const styles = require('./Transactions.scss');
    return (
      <div className={styles.widgets + ' container'}>
        <h1>
          Transactions
        </h1>
      </div>
    );
  }
}

