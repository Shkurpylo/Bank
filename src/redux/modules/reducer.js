import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';

import auth from './auth';
import { reducer as form } from 'redux-form';
import welcomeButtons from './welcomeButtons';
import cards from './cards';
import transaction from './transaction';


const appReducer = combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  welcomeButtons,
  cards,
  transaction
});

const rootReducer = (state, action) => {
  if (action.type === 'bank/auth/LOGOUT') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
