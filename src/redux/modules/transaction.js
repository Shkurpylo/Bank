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

const initialState = {
  transaction: [],
  showConfirmWindow: false,
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
    case LOAD:
      return {
        ...state,
        loading: true,
        data: action.result
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
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

export function getTransactions() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/getTransaction')
  };
}

export function newTransaction(from, to, amount) {
  const transaction = {
    sender: from,
    receiver: to,
    amount: amount
  };
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/addNewCard', {
      data: transaction
    }),
  };
}

export function confirmButton() {
  return {
    type: SHOW_CONFIRM_WINDOW,
  };
}
