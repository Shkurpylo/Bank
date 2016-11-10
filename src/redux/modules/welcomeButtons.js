const TOGGLE_FORMS = 'hello/TOGGLE_FORMS';

const initialState = {
  showLoginForm: false,
  showSignUpForm: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_FORMS:
      return {
        ... state,
        showLoginForm: action.showLoginForm,
        showSignUpForm: action.showSignUpForm
      };
    default:
      return state;
  }
}

export function showForm(showLoginForm, showSignUpForm) {
  return {
    type: TOGGLE_FORMS,
    showLoginForm,
    showSignUpForm
  };
}
