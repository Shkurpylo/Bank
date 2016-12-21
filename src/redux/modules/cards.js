const CARDS_LOAD = '/cards/CARDS_LOAD';
const CARDS_LOAD_SUCCESS = '/cards/CARDS_LOAD_SUCCESS';
const CARDS_LOAD_FAIL = '/cards/CARDS_LOAD_FAIL';

const LOAD_CARD = '/cards/LOAD_CARD';
const LOAD_CARD_SUCCESS = '/cards/LOAD_CARD_SUCCESS';
const LOAD_CARD_FAIL = '/cards/LOAD_CARD_FAIL';

const CONFIRM_DELETE = '/cards/CONFIRM_DELETE';

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
  cardForView: {},
  editing: {},
  updating: false,
  loadedCards: false,
  review: false,
  saveError: {},
  showAddForm: false,
  showCardView: false,
  showConfirmDelete: false
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
        showCardView: false,
        showAddForm: false
      };
    case CARDS_LOAD:
      return {
        ...state,
        loadingCardsList: true,
        loadedCards: false
      };
    case CARDS_LOAD_SUCCESS:
      return {
        ...state,
        loadingCardsList: false,
        loadedCards: true,
        cards: action.result,
        error: null
      };
    case CARDS_LOAD_FAIL:
      return {
        ...state,
        loadingCardsList: false,
        loadedCards: false,
        cards: null,
        error: action.error
      };

    case LOAD_CARD:
      return {
        ...state,
        showConfirmDelete: false,
        loadingCard: true,
      };
    case LOAD_CARD_SUCCESS:
      return {
        ...state,
        showCardView: true,
        showAddForm: false,
        loadingCard: false,
        cardForView: action.result,
        error: null
      };
    case LOAD_CARD_FAIL:
      return {
        ...state,
        showCardView: false,
        showAddForm: false,
        loadingCard: false,
        cardForView: null,
        error: action.error
      };
    case CONFIRM_DELETE:
      return {
        ...state,
        showConfirmDelete: action.values
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
        loadedCards: false,
        showConfirmDelete: false,
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
        loadedCards: false,
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
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
  return globalState.cards && globalState.cards.loadedCards;
}

export function getCards() {
  return {
    types: [CARDS_LOAD, CARDS_LOAD_SUCCESS, CARDS_LOAD_FAIL],
    promise: (client) => client.get('/getCards/')
  };
}

export function getCardByNumber(number) {
  return {
    types: [CARDS_LOAD],
    promise: (client) => client.get('/getCardByNumber?num=' + number)
  };
}

export function createCard(card) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/addNewCard', {
      data: {
        cardName: card.cardName,
        cardType: card.cardType || 'Mastercard'
      }
    })
  };
}

export function deleteCard(cardId) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del('/deleteCard?id=' + cardId),
  };
}

export function getCard(cardId) {
  return {
    types: [LOAD_CARD, LOAD_CARD_SUCCESS, LOAD_CARD_FAIL],
    promise: (client) => client.get('/getCardById?id=' + cardId)
  };
}

export function updateCard(card, id) {
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

export function closeCardView() {
  return {
    type: VIEW_CARD,
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}

export function confirmDeleteButton(values) {
  return {
    type: CONFIRM_DELETE,
    values
  };
}
