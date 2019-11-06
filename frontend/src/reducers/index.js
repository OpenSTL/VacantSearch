import { FETCH_FILTERED_LOTS } from "../constants/action-types";

const initialState = {
  searching: false,
  filteredLots: [],
};

function rootReducer (state = initialState, action) {
  if (action.type === `${FETCH_FILTERED_LOTS}_FULFILLED`) {
    return Object.assign({}, state, {
      filteredLots: action.payload.data.results,
      searching: false,
    });
  }

  if (action.type === `${FETCH_FILTERED_LOTS}_PENDING`) {
    return { ...state, searching: true }
  }

  if (action.type === `${FETCH_FILTERED_LOTS}_FAILED`) {
    return { ...state, searching: false }
  }

  return state;
}

export default rootReducer;
