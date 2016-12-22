import React from 'react';
// import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { TransactionConfirm } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('TransactionConfirm', () => {
  const mockStore = {
    auth: {
      user: {
        name: 'TEST'
      }
    },
    transaction: {
      transactionData: {
        sender: {
          number: 4019979782982532
        }
      },
      confirmInfo: {
        receiver: {
          name: 'TEST',
          lastName: 'McTEST'
        }
      }
    }
  };
  const store = createStore(browserHistory, client, mockStore);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <TransactionConfirm/>
    </Provider>
  );

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });
});
