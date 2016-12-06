const LOAD = '/transaction/LOAD';
const LOAD_SUCCESS = '/transaction/LOAD_SUCCESS';
const LOAD_FAIL = '/transaction/LOAD_FAIL';
const DELETE = '/transaction/DELETE';
const DELETE_SUCCESS = '/transaction/DELETE_SUCCESS';
const DELETE_FAIL = '/transaction/DELETE_FAIL';
const SAVE = '/transaction/SAVE';
const SAVE_SUCCESS = '/transaction/SAVE_SUCCESS';
const SAVE_FAIL = '/transaction/SAVE_FAIL';
const LOAD_INFO = '/transaction/LOAD_INFO';
const LOAD_INFO_SUCCESS = '/transaction/LOAD_INFO_SUCCESS';
const LOAD_INFO_FAIL = '/transaction/LOAD_INFO_FAIL';

const SHOW_CONFIRM_WINDOW = '/transaction/SHOW_CONFIRM_WINDOW';
const TOGGLE_FORMS = '/transaction/TOGGLE_FORMS';

const initialState = {
  sendingTransaction: false,
  transactions: [],
  showConfirmWindow: false,
  showOwnForm: false,
  loaded: false,
  saveError: {},
  transactionData: {},
  loadingInfo: false,
  confirmInfo: {},
  balanceChanged: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_CONFIRM_WINDOW:
      return {
        ...state,
        showConfirmWindow: false,
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
        loaded: false
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
        transactions: null,
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
      return {
        sendingTransaction: true,
        ...state}; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        loaded: false,
        showConfirmWindow: false,
        sendingTransaction: false,
        balanceChanged: true,
        saveError: {
          ...state.saveError,
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          // [action.id]: action.error
        }
      } : state;
    case LOAD_INFO:
      return {
        ...state,
        loadingInfo: true,
        showConfirmWindow: true,
        transactionData: action.result
      };
    case LOAD_INFO_SUCCESS:
      return {
        ...state,
        loadingInfo: false,
        confirmInfo: action.result
      };
    case LOAD_INFO_FAIL:
      return {
        ...state,
        loadingInfo: false,
        loadInfo: false,
        confirmInfo: null,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  globalState.transaction.loaded = false;
  return globalState.transactions && globalState.transaction.loaded;
}

export function getTransactions(query) {
  const queryParams = query || {};

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post('/getTransactions', {
      params: {
        cardID: queryParams.hasOwnProperty('cardID') ? queryParams.cardID : null,
        direction: queryParams.hasOwnProperty('direction') ? queryParams.direction : null,
        period: queryParams.hasOwnProperty('period') ? queryParams.period : null
      }
    })
  };
}

export function newTransaction(transaction) {
  console.log('transaction data:' + JSON.stringify(transaction));
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/addTransaction', {
      data: {
        receiver: transaction.receiver,
        sender: transaction.sender._id,
        amount: transaction.amount
      }
    }),
  };
}

export function switchForms(showOwnForm) {
  return {
    type: TOGGLE_FORMS,
    showOwnForm
  };
}

export function cancelTransaction() {
  return {
    type: SHOW_CONFIRM_WINDOW,
  };
}

export function confirmButton(values) {
  console.log('HERE IS SENDER+++>>> ' + JSON.stringify(values));
  return {
    types: [LOAD_INFO, LOAD_INFO_SUCCESS, LOAD_INFO_FAIL],
    promise: (client) => client.get('/getReceiverInfo?cardNumber=' + values.receiver),
    result: {
      sender: JSON.parse(values.sender),
      receiver: values.receiver,
      amount: values.amount
    }
  };
}

