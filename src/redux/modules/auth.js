const LOAD = 'bank/auth/LOAD';
const LOAD_SUCCESS = 'bank/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'bank/auth/LOAD_FAIL';
const LOGIN = 'bank/auth/LOGIN';
const LOGIN_SUCCESS = '/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'bank/auth/LOGIN_FAIL';
const LOGOUT = 'bank/auth/LOGOUT';
const LOGOUT_SUCCESS = 'bank/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'bank/auth/LOGOUT_FAIL';

const IS_VALID = '/signUp/IS_VALID';
const IS_VALID_SUCCESS = '/signUp/IS_VALID_SUCCESS';
const IS_VALID_FAIL = '/signUp/IS_VALID_FAIL';
const SIGNUP = '/signUp/SAVE';
const SIGNUP_SUCCESS = '/signUp/SAVE_SUCCESS';
const SIGNUP_FAIL = '/signUp/SAVE_FAIL';


const initialState = {
  loaded: false,
  saveError: null,
  loginFail: false,
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: true,
        loginFail: false,
        user: action.result.user
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginFail: true,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        state: initialState,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
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

    case SIGNUP:
      return state; // 'saving' flag handled by redux-form
    case SIGNUP_SUCCESS:
      // data = [...state.data];
      return {
        ...state,
        user: action.result.user,
      };
    case SIGNUP_FAIL:
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

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login', {
      data: {
        email: data.login,
        password: data.password
      }
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}

export function isValidEmail(data) {
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/signUp/isValid', {
      data
    })
  };
}

export function createNewUser(user) {
  return {
    types: [SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAIL],
    promise: (client) => client.post('/signUp/createNewUser', {
      data: user
    })
  };
}
