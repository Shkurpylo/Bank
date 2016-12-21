import React from 'react';
// import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { AddCardForm } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('AddCardForm', () => {
  const mockStore = {
    addCardForm: {
      cards: [],
      cardForView: {},
      editing: {},
      updating: false,
      loadedCards: false,
      review: false,
      saveError: {},
      showAddForm: false,
      showCardView: false,
    }
  };
  const store = createStore(browserHistory, client, mockStore);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <AddCardForm/>
    </Provider>
  );

  //   const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });
});
