import React from 'react';
// import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { LoginForm } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('LoginForm', () => {
  const store = createStore(browserHistory, client);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <LoginForm/>
    </Provider>
  );

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });
});
