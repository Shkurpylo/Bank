const TRANSACTION_LOAD = '/transaction/TRANSACTION_LOAD';
const TRANSACTION_LOAD_SUCCESS = '/transaction/TRANSACTION_LOAD_SUCCESS';
const TRANSACTION_LOAD_FAIL = '/transaction/TRANSACTION_LOAD_FAIL';

const TRANSACTION_SAVE = '/transaction/TRANSACTION_SAVE';
const TRANSACTION_SAVE_SUCCESS = '/transaction/TRANSACTION_SAVE_SUCCESS';
const TRANSACTION_SAVE_FAIL = '/transaction/TRANSACTION_SAVE_FAIL';

const TRANSACTION_LOAD_INFO = '/transaction/TRANSACTION_LOAD_INFO';
const TRANSACTION_LOAD_INFO_SUCCESS = '/transaction/TRANSACTION_LOAD_INFO_SUCCESS';
const TRANSACTION_LOAD_INFO_FAIL = '/transaction/TRANSACTION_LOAD_INFO_FAIL';

const IS_NUMBER_VALID = '/transaction/IS_NUMBER_VALID';
const IS_NUMBER_VALID_SUCCESS = '/transaction/IS_NUMBER_VALID_SUCCESS';
const IS_NUMBER_VALID_FAIL = '/transaction/IS_NUMBER_VALID_FAIL';

const TRANSACTION_SHOW_CONFIRM_WINDOW = '/transaction/TRANSACTION_SHOW_CONFIRM_WINDOW';
const TRANSACTION_TOGGLE_FORMS = '/transaction/TRANSACTION_TOGGLE_FORMS';
const TRANSACTION_HIDE_SUCCESS_ALERT = '/transaction/TRANSACTION_SHOW_SUCCESS_ALERT';

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
  alertSuccess: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TRANSACTION_SHOW_CONFIRM_WINDOW:
      return {
        ...state,
        showConfirmWindow: false,
      };
    case TRANSACTION_HIDE_SUCCESS_ALERT:
      return {
        ...state,
        alertSuccess: false,
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
    case TRANSACTION_SAVE:
      return {
        ...state,
        sendingTransaction: true,
      }; // 'saving' flag handled by redux-form
    case TRANSACTION_SAVE_SUCCESS:
      return {
        ...state,
        loaded: false,
        showConfirmWindow: false,
        sendingTransaction: false,
        balanceChanged: true,
        alertSuccess: true,
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
    case IS_NUMBER_VALID:
      return state; // 'saving' flag handled by redux-form
    case IS_NUMBER_VALID_SUCCESS:
      return {
        ...state,
        data: state.data,
        saveError: null,
      };
    case IS_NUMBER_VALID_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
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

export function alertSuccessHide() {
  // setTimeout(() => {
  return {
    type: TRANSACTION_HIDE_SUCCESS_ALERT,
  };
  // }, 2000);
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
      amount: values.amount,
      message: values.mess
    }
  };
}

export function isValidNumber(cardNumber) {
  console.log(' in reducer, req is: ' + JSON.stringify(cardNumber));
  return {
    types: [IS_NUMBER_VALID, IS_NUMBER_VALID_SUCCESS, IS_NUMBER_VALID_FAIL],
    promise: (client) => client.post('/isValidNumber', {
      data: cardNumber
    })
  };
}
