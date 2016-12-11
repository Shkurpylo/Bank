const TRANSACTION_LOAD = '/transaction/LOAD';
const TRANSACTION_LOAD_SUCCESS = '/transaction/LOAD_SUCCESS';
const TRANSACTION_LOAD_FAIL = '/transaction/LOAD_FAIL';
const TRANSACTION_DELETE = '/transaction/DELETE';
const TRANSACTION_DELETE_SUCCESS = '/transaction/DELETE_SUCCESS';
const TRANSACTION_DELETE_FAIL = '/transaction/DELETE_FAIL';
const TRANSACTION_SAVE = '/transaction/SAVE';
const TRANSACTION_SAVE_SUCCESS = '/transaction/SAVE_SUCCESS';
const TRANSACTION_SAVE_FAIL = '/transaction/SAVE_FAIL';
const TRANSACTION_LOAD_INFO = '/transaction/LOAD_INFO';
const TRANSACTION_LOAD_INFO_SUCCESS = '/transaction/LOAD_INFO_SUCCESS';
const TRANSACTION_LOAD_INFO_FAIL = '/transaction/LOAD_INFO_FAIL';

const TRANSACTION_SHOW_CONFIRM_WINDOW = '/transaction/SHOW_CONFIRM_WINDOW';
const TRANSACTION_TOGGLE_FORMS = '/transaction/TOGGLE_FORMS';

const initialState = {
  sendingTransaction: false,
  transactions: [],
  showConfirmWindow: false,
  showOwnForm: false,
  loaded: false,
  loadingTransactions: false,
  saveError: {},
  transactionData: {},
  loadingInfo: false,
  confirmInfo: {},
  balanceChanged: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TRANSACTION_SHOW_CONFIRM_WINDOW:
      return {
        ...state,
        showConfirmWindow: false,
      };
    case TRANSACTION_TOGGLE_FORMS:
      return {
        ...state,
        showOwnForm: action.showOwnForm,
      };
    case TRANSACTION_LOAD:
      return {
        ...state,
        loadingTransactions: true,
        loaded: false
      };
    case TRANSACTION_LOAD_SUCCESS:
      return {
        ...state,
        loadingTransactions: false,
        loaded: true,
        transactions: action.result,
        error: null
      };
    case TRANSACTION_LOAD_FAIL:
      return {
        ...state,
        loadingTransactions: false,
        loaded: false,
        transactions: null,
        error: action.error
      };
    case TRANSACTION_DELETE:
      return {
        ...state,
      };
    case TRANSACTION_DELETE_SUCCESS:
      return {
        ...state,
        loaded: false,
      };
    case TRANSACTION_DELETE_FAIL:
      return {
        ...state,
      };
    case TRANSACTION_SAVE:
      return {
        sendingTransaction: true,
        ...state
      }; // 'saving' flag handled by redux-form
    case TRANSACTION_SAVE_SUCCESS:
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
    case TRANSACTION_SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          // [action.id]: action.error
        }
      } : state;
    case TRANSACTION_LOAD_INFO:
      return {
        ...state,
        loadingInfo: true,
        showConfirmWindow: true,
        transactionData: action.result
      };
    case TRANSACTION_LOAD_INFO_SUCCESS:
      return {
        ...state,
        loadingInfo: false,
        confirmInfo: action.result
      };
    case TRANSACTION_LOAD_INFO_FAIL:
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

export function getTransactions(history) {
  console.log(history);
  const queryParams = history || {};
  return {
    types: [TRANSACTION_LOAD, TRANSACTION_LOAD_SUCCESS, TRANSACTION_LOAD_FAIL],
    promise: (client) => client.post('/getTransactions', {
      data: {
        cardID: queryParams.cardID || null,
        direction: queryParams.direction || 'all',
        dateBefore: queryParams.dateBefore || null,
        dateAfter: queryParams.dateAfter || null
      }
    })
  };
}

export function newTransaction(transaction) {
  console.log('transaction data:' + JSON.stringify(transaction));
  return {
    types: [TRANSACTION_SAVE, TRANSACTION_SAVE_SUCCESS, TRANSACTION_SAVE_FAIL],
    promise: (client) => client.post('/addTransaction', {
      data: {
        receiver: transaction.receiver,
        sender: transaction.sender._id,
        message: transaction.message,
        amount: transaction.amount,
      }
    }),
  };
}

export function switchForms(showOwnForm) {
  return {
    type: TRANSACTION_TOGGLE_FORMS,
    showOwnForm
  };
}

export function cancelTransaction() {
  return {
    type: TRANSACTION_SHOW_CONFIRM_WINDOW,
  };
}

export function confirmButton(values) {
  console.log('HERE IS SENDER+++>>> ' + JSON.stringify(values));
  return {
    types: [TRANSACTION_LOAD_INFO, TRANSACTION_LOAD_INFO_SUCCESS, TRANSACTION_LOAD_INFO_FAIL],
    promise: (client) => client.get('/getReceiverInfo?cardNumber=' + values.receiver),
    result: {
      sender: JSON.parse(values.sender),
      receiver: values.receiver,
      amount: values.amount
    }
  };
}
