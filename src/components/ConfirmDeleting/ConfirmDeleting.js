import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cardsActions from 'redux/modules/cards';

@connect((state) => ({
  deleteCard: state.cards.deleteCard,
}),
  dispatch => bindActionCreators(cardsActions, dispatch)
)

@reduxForm({
  form: 'deleteCard',
  fields: ['card'],
})
export default class ConfirmDeleting extends Component {
  static propTypes = {
    getCards: PropTypes.func,
    deleteCard: PropTypes.func,
    cardForView: PropTypes.object.isRequired,
    hideDeleteConfirm: PropTypes.func,
    confirmDeleteButton: PropTypes.func
  };

  render() {
    const styles = require('../AddCardForm/AddCardForm.scss');
    const {
      cardForView,
      getCards,
      deleteCard,
      confirmDeleteButton
    } = this.props;

    const handleDelete = (cardId) => {
      return deleteCard(cardId)
        .then(getCards());
    };

    return (
<div className={styles.delButton}>
<h4 style={{textAlign: 'right', marginRight: 30}}> Are you sure? </h4>
            <button className="btn btn-danger"
              style={{marginLeft: 160}}
              onClick={() => handleDelete(cardForView._id)}>
              <i className="fa fa-check" aria-hidden="true">
              </i> Yes, delete this card</button>
               <button className="btn btn-success"
               style={{marginLeft: 15}}
              onClick={() =>confirmDeleteButton(false)}>
              <i className="fa fa-times" aria-hidden="true">
              </i> No, keep card</button>
          </div>
    );
  }
}
