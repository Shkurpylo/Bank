import React from 'react';
// import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect } from 'chai';
import { CardView } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('CardView', () => {
  const mockStore = {
    cards: {
      cardForView: {},
      editing: {},
      showCardView: true,
      deleteCard: () => {}
    }
  };
  const store = createStore(browserHistory, client, mockStore);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <CardView/>
    </Provider>
  );
//   const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });

//   it('should render with correct value', () => {
//     const text = dom.getElementsByTagName('strong')[0].textContent;
//     expect(text).to.equal(mockStore.info.data.message);
//   });

//   it('should render with a reload button', () => {
//     const text = dom.getElementsByTagName('button')[0].textContent;
//     expect(text).to.be.a('string');
//   });

//   it('should render the correct className', () => {
//     const styles = require('components/InfoBar/InfoBar.scss');
//     expect(styles.infoBar).to.be.a('string');
//     expect(dom.className).to.include(styles.infoBar);
//   });
});
