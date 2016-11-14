const LOAD = '/cards/LOAD';
const LOAD_SUCCESS = '/cards/LOAD_SUCCESS';
const LOAD_FAIL = '/cards/LOAD_FAIL';
const DELETE = '/cards/DELETE';
const DELETE_SUCCESS = '/cards/DELETE_SUCCESS';
const DELETE_FAIL = '/cards/DELETE_FAIL';
const SAVE = '/cards/SAVE';
const SAVE_SUCCESS = '/cards/SAVE_SUCCESS';
const SAVE_FAIL = '/cards/SAVE_FAIL';
const REVIEW_CARD = '/cards/REVIEW_CARD';
const SHOW_ADD_FORM = '/cards/SHOW_ADD_FORM';

const initialState = {
  loaded: false,
  review: {},
  saveError: {},
  showAddForm: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REVIEW_CARD:
      return {
        ...state,
        review: action.review
      };
    case SHOW_ADD_FORM:
      return {
        ...state,
        showAddForm: action.showAddForm
      };
    case LOAD:
      return {
        ...state,
        loading: true,
       // data: action.result // changed
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
        editing: {
          ...state,
          [action.id]: true
        }
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        editing: {
          ...state.review,
          [action.id]: false
        }
      };
    case DELETE_FAIL:
      return {
        ...state,
        editing: {
          ...state.review,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.review,
          [action.id]: false
        },
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
  return globalState.cards && globalState.cards.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/cards/getCards')
  };
}

export function save(card) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/cards/addNewCard', {
      data: card
    })
  };
}

export function deleteCard(cardId) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.get('/cards/deleteCard/' + cardId)
  };
}

export function reviewCard(cardId) {
  return {
    types: [LOAD],
    promise: (client) => client.get('/cards/getCard/' + cardId)
  };
}

export function addButton(showAddForm) {
  return {
    type: SHOW_ADD_FORM,
    showAddForm
  };
}
