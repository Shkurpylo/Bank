import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { WelcomeButtons } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('WelcomeButtons', () => {
  const mockStore = {
    welcomeButtons: {
      showLoginForm: false,
      showSignUpForm: false,
    }
  };
  const store = createStore(browserHistory, client, mockStore);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <WelcomeButtons/>
    </Provider>
  );

  const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });

  it('should render with a login button', () => {
    const text = dom.getElementsByTagName('button')[0].textContent;
    expect(text).to.equals('Log In ');
    expect(text).to.be.a('string');
  });
  it('should render with a signup button', () => {
    const text = dom.getElementsByTagName('button')[1].textContent;
    expect(text).to.be.a('string');
    expect(text).to.equals('Sign Up ');
  });
});
