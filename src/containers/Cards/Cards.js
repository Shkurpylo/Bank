import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { initializeWithKey } from 'redux-form';
import { isLoaded, getCards as loadCards } from 'redux/modules/cards';
import * as cardsActions from 'redux/modules/cards';
import { AddCardForm, CardView } from 'components';

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
    loadingCardsList: state.cards.loadingCardsList,
    showAddForm: state.cards.showAddForm,
    showCardView: state.cards.showCardView,
    addButton: state.cards.addButton,
    createCard: state.cards.createCard,
  }), {...cardsActions, initializeWithKey })
export default class Cards extends Component {
  static propTypes = {
    cards: PropTypes.array,
    showAddForm: PropTypes.bool,
    showCardView: PropTypes.bool,
    createCard: PropTypes.func,
    addButton: PropTypes.func,
    getCard: PropTypes.func,
    closeCardView: PropTypes.func,
    initializeWithKey: PropTypes.func.isRequired,
    loadingCardsList: PropTypes.bool,
    error: PropTypes.string,
    user: PropTypes.object,
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
    } = this.props;
    return (
      <div className={' container'}>
      <div className ="row">
      <div className={'col-md-3'}>
        <Helmet title="Cards"/>
        <h1 className={styles.title}>My Cards</h1>
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
          <div className={ styles.cardsList + ' col-md-6 panel panel-default'}>
            {
              loadingCardsList && <div className={styles.loadingDiv}>
            <i className={styles.loading + ' fa fa-refresh fa-spin fa-3x fa-fw'}></i> </div>
             || cards && cards.length &&
            <table className="table table-hover ">
              <thead>
              <tr>
                <th className={styles.typeCol}>Type</th>
                <th className={styles.nameCol}>Name</th>
                <th className={styles.numberCol}>Number</th>
                <th className={styles.balanceCol}>Balance</th>
                <th className={styles.buttonCol}></th>
              </tr>
              </thead>
              <tbody>
              {
                cards.map((card) =>
                  <tr key={card._id}>
                    <td className={styles.type} ><i classID="cardIcons" className=
                    {isVisa(card.number) ? 'fa fa-cc-visa fa-2x' : 'fa fa-cc-mastercard fa-2x' }></i></td>
                    <td className={styles.name} >{card.name}</td>
                    <td className={styles.number} >{card.number}</td>
                    <td className={styles.balance} >{card.balance + '$'}</td>
                    <td className={styles.button} >
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
            <CardView
            getCard={() => this.getCard().bind(this)}
            closeCardView={() => this.closeCardView().bind(this)}
            />}
          </div>
        </div>
      </div>
    );
  }
}
