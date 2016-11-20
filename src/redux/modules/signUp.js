const ADD_NEW_USER = '/signUp/ADD_NEW_USER';
const IS_VALID = '/signUp/IS_VALID';
const IS_VALID_SUCCESS = '/signUp/IS_VALID_SUCCESS';
const IS_VALID_FAIL = '/signUp/IS_VALID_FAIL';
const SAVE = '/signUp/SAVE';
const SAVE_SUCCESS = '/signUp/SAVE_SUCCESS';
const SAVE_FAIL = '/signUp/SAVE_FAIL';

const initialState = {
  addError: null
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_NEW_USER:
      return {
        ...state,
      };
    case IS_VALID:
      return state; // 'saving' flag handled by redux-form
    case IS_VALID_SUCCESS:
      const values = [...state.values];
      values[action.result.id - 1] = action.result;
      return {
        ...state,
        values: values,
        saveError: null,
      };
    case IS_VALID_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;

    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;

    default:
      return state;
  }
}

export function isValidEmail(values) {
  console.log('=============>>>>>>' + JSON.stringify(values));
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/survey/isValid', {
      values: values
    })
  };
}

export function createNewUser(user) {
  console.log('=============>>>>>>' + JSON.stringify(user));
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/createNewUser', {
      data: user
    })
  };
}
