import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import nameValidation from './nameValidation';
import * as cardsActions from 'redux/modules/cards';

@connect((state) => ({
  saveError: state.cards.saveError
}),
  dispatch => bindActionCreators(cardsActions, dispatch)
)

@reduxForm({
  form: 'newCard',
  fields: ['cardName', 'cardType'],
  validate: nameValidation
})
export default class AddCardForm extends Component {
  static propTypes = {
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    createCard: PropTypes.func,
    values: PropTypes.object,
    saveError: PropTypes.object,
    getCards: PropTypes.func
  };

  render() {
    const styles = require('./AddCardForm.scss');
    const {
      fields: { cardName,
      cardType = 'VISA' },
      handleSubmit,
      resetForm,
      values,
      createCard,
      getCards
    } = this.props;

    return (
      <form >
        <div className="center-block jumbotron">
        <div className = {styles.centered + ' col-sm-9'}>
          <div className="row">
            <div className="form-group">
              <div className={styles.centered + ' col-sm-12'}>
                <label htmlFor="cardName">Cards name:</label>
                <input type="name" className="col-xs-3 form-control" id="cardName" placeholder="name" {...cardName} />
                  {cardName.error && cardName.touched ? <div className={styles.errorText + ' text-danger'}>{cardName.error}</div> : <p></p>}
              </div>
            </div>
          </div>

          <div className="row">
          <div className="col-md-8">
          <label htmlFor="radio" style={{paddingTop: 20, marginBottom: 1}}>Select type:</label>
            <div className="radio">
              <label>
                <input type="radio" {...cardType} value="VISA" checked={cardType.value === 'VISA'}/>
                   VISA
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" {...cardType} value="Mastercard" checked={cardType.value !== 'VISA'} />
                   Mastercard
              </label>
            </div>
            </div>

            <button className="btn btn-success pull-right" style={{marginRight: 20}}
            onClick={handleSubmit(() => createCard(values)
            .then(getCards)
            .then(resetForm))}>
              <i className="fa fa-plus"/> Add
            </button>
            <button className="btn btn-warning pull-right" style={{marginRight: 20}} onClick={resetForm} >
              <i className="fa fa-undo"/> Reset
            </button>
          </div>
          </div>
        </div>
      </form>
    );
  }
}
