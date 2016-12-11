const LOAD = '/cards/LOAD';
const LOAD_SUCCESS = '/cards/LOAD_SUCCESS';
const LOAD_FAIL = '/cards/LOAD_FAIL';
const DELETE = '/cards/DELETE';
const DELETE_SUCCESS = '/cards/DELETE_SUCCESS';
const DELETE_FAIL = '/cards/DELETE_FAIL';
const SAVE = '/cards/SAVE';
const SAVE_SUCCESS = '/cards/SAVE_SUCCESS';
const SAVE_FAIL = '/cards/SAVE_FAIL';

const SHOW_ADD_FORM = '/cards/SHOW_ADD_FORM';
const VIEW_CARD = '/cards/VIEW_CARD';

const EDIT_START = '/cards/EDIT_START';
const EDIT_STOP = '/cards/EDIT_STOP';

const UPDATE = '/cards/UPDATE';
const UPDATE_SUCCESS = '/cards/UPDATE_SUCCESS';
const UPDATE_FAIL = '/cards/UPDATE_FAIL';

const initialState = {
  cards: [],
  card: {},
  editing: {},
  updating: false,
  loaded: false,
  review: false,
  saveError: {},
  showAddForm: false,
  showCardView: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHOW_ADD_FORM:
      return {
        ...state,
        showAddForm: action.showAddForm,
        showCardView: false
      };
    case VIEW_CARD:
      return {
        ...state,
        card: action.card,
        showCardView: true,
        showAddForm: false
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
        cards: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        cards: null,
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
        showCardView: false,
        loaded: false,
        editing: {
          ...state.review,
          [action.id]: false,
        }
      };
    case DELETE_FAIL:
      return {
        ...state,
        editing: {
          ...state.review,
          [action.id]: false,
        }
      };
    case SAVE:
      return state;

    case SAVE_SUCCESS:
      return {
        ...state,
        loaded: false,
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          // [action.id]: action.error
        }
      } : state;
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case UPDATE:
      return {
        updating: true,
        ...state
      }; // 'saving' flag handled by redux-form
    case UPDATE_SUCCESS:
      return {
        updating: false,
        ...state
      };
    case UPDATE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        updating: false,
        saveError: {
          ...state.saveError,
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  if (globalState.transaction.balanceChanged === true) {
    globalState.cards.loaded = false;
    globalState.transaction.balanceChanged = false;
  }
  return globalState.cards && globalState.cards.loaded;
}

export function getCards() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/getCards/')
  };
}

export function getCardByNumber(number) {
  return {
    types: [LOAD],
    promise: (client) => client.get('/getCardByNumber?num=' + number)
  };
}

export function createCard(card) {
  console.log('In modules/createCard');
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/addNewCard', {
      data: card
    })
  };
}

export function deleteCard(cardId) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del('/deleteCard?id=' + cardId),
  };
}

export function reviewCard(cardId) {
  return {
    types: [LOAD],
    promise: (client) => client.get('/cards/getCard/' + cardId)
  };
}


export function updateCard(card, id) {
  console.log(JSON.stringify(card) + ' id: ' + id );
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/updateCard', {
      data: {
        name: card.name,
        id: id
      }
    })
  };
}

export function addButton(showAddForm) {
  return {
    type: SHOW_ADD_FORM,
    showAddForm
  };
}

export function viewButton(card) {
  return {
    type: VIEW_CARD,
    card,
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
