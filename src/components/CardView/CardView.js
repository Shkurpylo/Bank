import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import renameValidation from './renameValidation';
import * as cardsActions from 'redux/modules/cards';

const dateFormat = (date) => {
  const formatingDate = new Date(date);
  const options = {
    year: 'numeric',
    month: 'numeric',
  };
  return (formatingDate.toLocaleString('en-US', options));
};
const numberFormat = (number) => {
  const numberArr = ('' + number).split('');
  numberArr.splice(4, 0, '\xa0\xa0');
  numberArr.splice(9, 0, '\xa0\xa0');
  numberArr.splice(14, 0, '\xa0\xa0');
  return numberArr.join('');
};

@connect((state) => ({
  cardForView: state.cards.cardForView,
  deleteCard: state.cards.deleteCard,
  editing: state.cards.editing,
  saveError: state.cards.saveError,
  updateCard: state.cards.updateCard,
}),
  dispatch => bindActionCreators(cardsActions, dispatch)
)
@reduxForm({
  form: 'card',
  fields: ['name'],
  validate: renameValidation
})
export default class CardView extends Component {
  static propTypes = {
    // card: PropTypes.object.isRequired,
    getCard: PropTypes.func.isRequired,
    deleteCard: PropTypes.func,
    getCards: PropTypes.func,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    fields: PropTypes.object.isRequired,
    editing: PropTypes.object,
    saveError: PropTypes.object,
    values: PropTypes.object.isRequired,
    updateCard: PropTypes.func,
    cardForView: PropTypes.object
  };

  render() {
    const {
      fields: { name },
      getCard,
      editStop,
      invalid,
      pristine,
      cardForView,
      submitting,
      deleteCard,
      getCards,
      editing,
      updateCard,
      // saveError: {
      //   [card._id]: saveError
      // },
      values
    } = this.props;

    const handleEdit = (handleCard) => {
      const { editStart } = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(handleCard._id));
    };
    const handleDelete = (cardId) => {
      return deleteCard(cardId)
        .then(getCards());
    };
    const handleUpdate = (newValue, cardId) => {
      return updateCard(newValue, cardId)
        .then(result => {
          console.log('in handleSubmit: ' + values.name);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        })
        .then(getCards())
        .then(getCard(cardForView._id))
        .then(editStop(String(cardForView._id)));
    };

    const styles = require('./CardView.scss');
    return (

      <div className={styles.cardView + ' col-md-12'}>
        {
          editing[cardForView._id]
          ?
          <div formKey={cardForView.name}>
            <div className="col-md-6">
              <input type="text"
                onBlur={() => editStop(String(cardForView._id))}
                key={String(cardForView._id)}
                value={cardForView.name}
                className="form-control"
                {...name}/>
            </div>

            <button
              className="btn btn-default"
              onClick={() => editStop(String(cardForView._id))}
              disabled={submitting}>
              <i className="fa fa-ban"/>
                 Cancel
            </button>
              <button
                className="btn btn-success"
                onClick={() => handleUpdate(values, cardForView._id)}
                disabled={pristine || invalid || submitting}>
                <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
              </button>
              <div className="row">
              {name.error && name.touched && <div className="text-danger">{name.error}</div>}

              </div>
            </div>
            :
          <div className={styles.cardName}>
            {cardForView.name}
          <button className="btn btn-link" onClick={handleEdit(cardForView)}
          >Change Name</button>
          </div>
          }

         <div className={styles.bgimg}>
           <p> </p>
           <div className={styles.cardNumber}>{numberFormat(cardForView.number)}</div>
           <div className={styles.explDate + ' col-md-5'}>{dateFormat(cardForView.explDate)}</div>
           <div className={styles.cvv}> {cardForView.cvv} </div>
           <div className={styles.balance}>
             Balance: {cardForView.balance + '$'}
           </div>
           <div className={styles.delButton}>
            <button className="btn btn-danger"
              onClick={() => handleDelete(cardForView._id)}>
              <i className="fa fa-trash" aria-hidden="true">
              </i> Delete Card</button>
          </div>
         </div>

      </div>

    );
  }
}
