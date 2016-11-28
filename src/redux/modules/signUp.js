
const IS_VALID = '/signUp/IS_VALID';
const IS_VALID_SUCCESS = '/signUp/IS_VALID_SUCCESS';
const IS_VALID_FAIL = '/signUp/IS_VALID_FAIL';
const SAVE = '/signUp/SAVE';
const SAVE_SUCCESS = '/signUp/SAVE_SUCCESS';
const SAVE_FAIL = '/signUp/SAVE_FAIL';

const initialState = {
  saveError: null,
  data: []
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IS_VALID:
      return state; // 'saving' flag handled by redux-form
    case IS_VALID_SUCCESS:
      return {
        ...state,
        data: state.data,
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
    //  data = [...state.data];
      return {
        ...state,
        data: state.data,
        saveError: null
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

export function isValidEmail(data) {
  console.log('=============>>>>>>' + JSON.stringify(data));
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/signUp/isValid', {
      data
    })
  };
}

export function createNewUser(user) {
  console.log('=============>>>>>>' + JSON.stringify(user));
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/signUp/createNewUser', {
      data: user
    })
  };
}
