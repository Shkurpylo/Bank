const LOAD = '/transaction/LOAD';
const LOAD_SUCCESS = '/transaction/LOAD_SUCCESS';
const LOAD_FAIL = '/transaction/LOAD_FAIL';
const DELETE = '/transaction/DELETE';
const DELETE_SUCCESS = '/transaction/DELETE_SUCCESS';
const DELETE_FAIL = '/transaction/DELETE_FAIL';
const SAVE = '/transaction/SAVE';
const SAVE_SUCCESS = '/transaction/SAVE_SUCCESS';
const SAVE_FAIL = '/transaction/SAVE_FAIL';

const SHOW_CONFIRM_WINDOW = '/transaction/SHOW_CONFIRM_WINDOW';
const TOGGLE_FORMS = '/transaction/TOGGLE_FORMS';

const initialState = {
  transactions: [],
  showConfirmWindow: false,
  showOwnForm: false,
  loaded: false,
  saveError: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_CONFIRM_WINDOW:
      return {
        ...state,
        showConfirmWindow: true
      };
    case TOGGLE_FORMS:
      return {
        ...state,
        showOwnForm: action.showOwnForm,
      };
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        transactions: action.result,
        error: null

      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case DELETE:
      return {
        ...state,
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        loaded: false,
      };
    case DELETE_FAIL:
      return {
        ...state,
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        loaded: false,
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

export function isLoaded(globalState) {
  return globalState.transaction && globalState.transaction.loaded;
}

export function getTransactions() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/getTransactions')
  };
}

export function newTransaction(transaction) {
  console.log(transaction);
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/addTransaction', {
      data: transaction
    }),
  };
}

export function confirmButton() {
  return {
    type: SHOW_CONFIRM_WINDOW,
  };
}

export function switchForms(showOwnForm) {
  return {
    type: TOGGLE_FORMS,
    showOwnForm
  };
}
