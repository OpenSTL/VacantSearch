import { SET_FILTERED_LOTS } from "../constants/action-types";

const initialState = {
  filteredLots: [],
};

function rootReducer (state = initialState, action) {
  if (action.type === SET_FILTERED_LOTS) {
    return Object.assign({}, state, {
      filteredLots: action.payload,
    });
  }
  return state;
}

export default rootReducer;
