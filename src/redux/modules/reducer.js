import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import {reducer as form} from 'redux-form';
import signUp from './signUp';
import welcomeButtons from './welcomeButtons';
import cards from './cards';
import transaction from './transaction';


export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  signUp,
  welcomeButtons,
  cards,
  transaction
});
