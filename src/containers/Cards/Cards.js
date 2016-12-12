import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { initializeWithKey } from 'redux-form';
import { isLoaded, getCards as loadCards } from 'redux/modules/cards';
import * as cardsActions from 'redux/modules/cards';
import { AddCardForm, CardView } from 'components';

// const hideHumber = (number) => {
//   const stringCartNumber = number.toString();
//   return stringCartNumber.slice(0, 4) + '........' + stringCartNumber.slice(-4);
// };

const isVisa = (number) => {
  const firstDigit = (number + '')[0];
  return firstDigit === '4' ? true : false;
};

@asyncConnect([{
  deferred: true,
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadCards());
    }
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    cards: state.cards.cards,
    review: state.cards.review,
    error: state.cards.error,
    // loadedCards: state.cards.loadedCards,
    loadingCardsList: state.cards.loadingCardsList,
    showAddForm: state.cards.showAddForm,
    showCardView: state.cards.showCardView,
    addButton: state.cards.addButton,
    createCard: state.cards.createCard,
    // editing: state.cards.editing
  }), {...cardsActions, initializeWithKey })
export default class Cards extends Component {
  static propTypes = {
    // initialize: PropTypes.func.isRequired,
    cards: PropTypes.array,
    // reviewCard: PropTypes.func,
    showAddForm: PropTypes.bool,
    showCardView: PropTypes.bool,
    createCard: PropTypes.func,
    addButton: PropTypes.func,
    getCard: PropTypes.func,
    initializeWithKey: PropTypes.func.isRequired,
    loadingCardsList: PropTypes.bool,
    error: PropTypes.string,
    user: PropTypes.object,
    // submitting: PropTypes.bool.isRequired,
  };

  render() {
    const styles = require('./Cards.scss');
    const {
      cards,
      addButton,
      getCard,
      showAddForm,
      showCardView,
      loadingCardsList,
      // submitting
    } = this.props;
    return (
      <div className={'container'}>
        <Helmet title="Cards"/>
      <div className ="row">
      <div className={styles.titleh + ' col-md-2'}>
        <h1 >My Cards</h1>
      </div>
      <div className="col-md-4">
          <button className=
          {styles.addButton +
            (showAddForm ? ' btn btn-primary active' : ' btn btn-primary') + ' pull-right'}
           onClick={() => addButton(!showAddForm)}>
            Add new card
          </button>
      </div>
      </div>
        <div>
        </div>
        <div className="row">
          <div className="col-md-6 panel panel-default">
            {
              loadingCardsList && <div className={styles.loadingDiv}>
            <i className={styles.loading + ' fa fa-refresh fa-spin fa-3x fa-fw'}></i> </div>
             || cards && cards.length &&
            <table className="table table-hover ">
              <thead>
              <tr>
                <th className={styles.colorCol}>Type</th>
                <th className={styles.sprocketsCol}>Name</th>
                <th className={styles.ownerCol}>Number</th>
                <th className={styles.ownerCol}>Balance</th>
                <th className={styles.buttonCol}>Button</th>
              </tr>
              </thead>
              <tbody>
              {
                cards.map((card) =>
                  <tr key={card._id}>
                    <td className={styles.idCol} ><i classID="cardIcons" className=
                    {isVisa(card.number) ? 'fa fa-cc-visa fa-2x' : 'fa fa-cc-mastercard fa-2x' }></i></td>
                    <td className={styles.colorCol} >{card.name}</td>
                    <td className={styles.ownerCol} >{card.number}</td>
                    <td className={styles.ownerCol} >{card.balance + '$'}</td>
                    <td className={styles.buttonCol} >
                      <button key={card._id} className="btn btn-info btn-sm"
                              onClick={() => {getCard(card._id);}}>
                        <i className="fa fa-credit-card"/> select
                      </button>
                    </td>
                  </tr>)
              }
              </tbody>
            </table>
            || <div className={styles.loadingDiv}>
            <i className={styles.nocards}>You have not cards yet</i> </div>
          }
          </div>
          <div className="col-md-5 pull-right">

            { showAddForm &&
            <AddCardForm />}

            { showCardView &&
            <CardView getCard={() => this.getCard().bind(this)}/>}

          </div>
        </div>
      </div>
    );
  }
}
