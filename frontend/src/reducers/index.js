import {
    FETCH_FILTERED_LOTS,
    SET_FLY_TO_COORDINATES
} from "../constants/action-types";

const initialState = {
  filteredLots: [],
  flyToCoordinates: [0, 0],
  searching: false,
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
  
  if (action.type === SET_FLY_TO_COORDINATES) {
    return Object.assign({}, state, {
      flyToCoordinates: action.payload,
    });
  }
  
  return state;
}

export default rootReducer;
