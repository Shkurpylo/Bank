import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import {isLoaded, addButton, load as loadCards} from 'redux/modules/cards';
// import {isLoaded} from 'redux/modules/cards';
import Helmet from 'react-helmet';
import {initializeWithKey} from 'redux-form';
import * as cardsActions from 'redux/modules/cards';

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
    cards: state.cards.data,
    review: state.widgets.review,
    error: state.widgets.error,
    loading: state.cards.loading
  }),
  {...cardsActions, addButton, initializeWithKey })
export default class Cards extends Component {
  static propTypes = {
    cards: PropTypes.array,
    // reviewCard: PropTypes.func,
    showAddForm: PropTypes.bool,
    addButton: PropTypes.func,
    load: PropTypes.func.isRequired,
    initializeWithKey: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string
  };


  render() {
    const style = require('./Cards.scss');
    const {cards, showAddForm} = this.props;

    return (
      <div className={style.widgets + ' container'}>
        <Helmet title="Cards"/>
        <h1 className={style}>My Cards</h1>
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
                      <button key={card.id} className="btn btn-primary" >
                        <i className="fa fa-pencil"/> Edit
                      </button>
                    </td>
                  </tr>)
              }
              </tbody>
            </table> }
          </div>
          <div className="col-md-7 pull-right">
            <div>
              <button className="btn btn-primary" onClick={()=>addButton(!showAddForm)} >
                Add new card
              </button>
            </div>
            { showAddForm && <div className="btn-group">
              <button type="button" className="btn btn-success">Add Mastercard</button>
              <button type="button" className="btn btn-success">Add VISA</button>
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
