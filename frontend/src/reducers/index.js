import { SET_FILTERED_LOTS, SET_FLY_TO_COORDINATES } from "../constants/action-types";

const initialState = {
  flyToCoordinates: [0, 0],
  filteredLots: [],
};

function rootReducer (state = initialState, action) {
  if (action.type === SET_FILTERED_LOTS) {
    return Object.assign({}, state, {
      filteredLots: action.payload,
    });
  } else if (action.type === SET_FLY_TO_COORDINATES) {
    return Object.assign({}, state, {
      flyToCoordinates: action.payload,
    });
  }
  return state;
}

export default rootReducer;
