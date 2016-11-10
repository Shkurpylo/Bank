const ADD_NEW_USER = '/signUp/ADD_NEW_USER';
const IS_VALID = '/signUp/IS_VALID';
const IS_VALID_SUCCESS = '/signUp/IS_VALID_SUCCESS';
const IS_VALID_FAIL = '/signUp/IS_VALID_FAIL';

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
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        saveError: null,
      };
    case IS_VALID_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;

    default:
      return state;
  }
}

export function isValidEmail(data) {
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/survey/isValid', {
      data
    })
  };
}

export function createNewUser(user) {
  return {
    types: ADD_NEW_USER,
    promise: (client) => client.post('/createNewUser', {
      data: {
        user: user,
      }
    })
  };
}
