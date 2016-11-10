const TOGGLE_LOGIN_FORM = 'redux-example/signUp/TOGGLE_LOGIN_FORM';


const initialState = {
  loaded: false,
  showLoginForm: true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_LOGIN_FORM:
      return {
        ...state,
        showLoginForm: action.result
      };

    default:
      return state;
  }
}

export function showLoginF(showLoginForm) {
  return {
    type: TOGGLE_LOGIN_FORM,
    showLoginForm
  };
}
