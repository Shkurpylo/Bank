import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cardsActions from 'redux/modules/cards';

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
  };

  render() {
    const {
      card,
      deleteCard,
    } = this.props;
    const style = require('./CardView.scss');
    return (
    <div className="panel panel-info" id={style.panel}>
      <div className="panel-heading">Card</div>
      <div className="row">
        Name: {card.name}
        <button className="btn btn-success"
                 >Change Name</button>
      </div>
      <div className="row">
        Number: {card.number}
      </div>
      <div className="row">
        cvv: {card.cvv}
      </div>
      <div className="row">
        explDate: {card.explDate}
      </div>
      <div className="row">
        Balance: not yet
      </div>
      <div className="row">
        <div className={style.buttons}>
          <button className="btn btn-danger"
                  onClick={() => deleteCard(card._id)} >Delete Card</button>
        </div>
      </div>
    </div>
    );
  }
}
