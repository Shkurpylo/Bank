import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import {initializeWithKey} from 'redux-form';
import {initialize} from 'redux-form';
import {isLoaded, getCards as loadCards} from 'redux/modules/cards';
import * as cardsActions from 'redux/modules/cards';
import {AddCardForm, CardView} from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadCards());
    }
  }
}])
@connect(
  state => ({
    cards: state.cards.cards,
    review: state.cards.review,
    error: state.cards.error,
    loaded: state.cards.loaded,
    loading: state.cards.loading,
    showAddForm: state.cards.showAddForm,
    showCardView: state.cards.showCardView,
    addButton: state.cards.addButton,
    createCard: state.cards.createCard,
  }),
  {...cardsActions, initialize, initializeWithKey })
export default class Cards extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    cards: PropTypes.array,
    // reviewCard: PropTypes.func,
    showAddForm: PropTypes.bool,
    showCardView: PropTypes.bool,
    createCard: PropTypes.func,
    addButton: PropTypes.func,
    viewButton: PropTypes.func,
    initializeWithKey: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string
  };

  render() {
    const style = require('./Cards.scss');
    const {cards,
      addButton,
      viewButton,
      showAddForm,
      showCardView
    } = this.props;
    return (
      <div className={style.widgets + ' container'}>
        <Helmet title="Cards"/>
        <h1 className={style}>My Cards</h1>
        <div>
          <button className="btn btn-primary" onClick={() => addButton(!showAddForm)}>
            Add new card
          </button>
        </div>
        <div className="row">
          <div className="col-md-5">
            {cards && cards.length &&
            <table className="table table-hover">
              <thead>
              <tr>
                <th className={style.colorCol}>Type</th>
                <th className={style.sprocketsCol}>Number</th>
                <th className={style.ownerCol}>Bal</th>
                <th className={style.buttonCol}>Button</th>
              </tr>
              </thead>
              <tbody>
              {
                cards.map((card) =>
                  <tr key={card._id}>
                    <td className={style.idCol} >{card.name}</td>
                    <td className={style.colorCol} >{card.number}</td>
                    <td className={style.ownerCol} >{card.cvv}</td>
                    <td className={style.buttonCol} >
                      <button key={card.id} className="btn btn-info btn-sm"
                              onClick={() => {viewButton(card);}}>
                        <i className="fa fa-credit-card"/> select
                      </button>
                    </td>
                  </tr>)
              }
              </tbody>
            </table> }
          </div>
          <div className="col-md-5 pull-right">

            { showAddForm &&
            <AddCardForm loadCards/>}

            { showCardView &&
            <CardView onClick={() => loadCards}/>}

          </div>
        </div>
      </div>
    );
  }
}
