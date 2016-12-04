import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cardsActions from 'redux/modules/cards';

const dateFormat = (date) => {
  const formatingDate = new Date(date);
  const options = {
    year: 'numeric',
    month: 'numeric',
  };
  return (formatingDate.toLocaleString('en-US', options));
};

@connect((state) => ({
  card: state.cards.card,
  deleteCard: state.cards.deleteCard,
}),
  dispatch => bindActionCreators(cardsActions, dispatch)
)
export default class CardView extends Component {
  static propTypes = {
    card: PropTypes.object,
    deleteCard: PropTypes.func,
    getCards: PropTypes.func
  };

  render() {
    const {
      card,
      deleteCard,
      getCards
    } = this.props;
    const style = require('./CardView.scss');
    return (
    <div className="panel panel-info" id={style.panel}>
      <div className="panel-heading">Card</div>
      <div className="row">
        <div className="col-md-4">
        </div>
        <div className="col-md-6">
         {card.name}
        <button className="btn btn-link">Change Name</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          Number:
        </div>
        <div className="col-md-6">
          {card.number}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          cvv:
        </div>
        <div className="col-md-6">
          {card.cvv}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          explDate:
          </div>
        <div className="col-md-6">
           {dateFormat(card.explDate)}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          Balance:
        </div>
        <div className="col-md-6">
          {card.balance + '$'}
        </div>
      </div>
      <div className="row">
        <div className={style.buttons}>
          <button className="btn btn-danger"
                  onClick={() => deleteCard(card._id)
                    .then(getCards())}>
                    Delete Card</button>
        </div>
      </div>
    </div>
    );
  }
}
