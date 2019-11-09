import * as tabs from '../constants/tabs';
import {
    FETCH_FILTERED_LOTS,
    SET_FLY_TO_COORDINATES,
    SET_LOT_EXPANDED,
    SET_SELECTED_TAB,
} from "../constants/action-types";

const initialState = {
  filteredLots: [],
  flyToCoordinates: {
    coordinates: [0, 0],
    timestamp: 0,
  },
  searching: false,
  selectedTab: tabs.SEARCH,
};

function rootReducer (state = initialState, action) {
  if (action.type === `${FETCH_FILTERED_LOTS}_FULFILLED`) {
    return {
      ...state,
      filteredLots: action.payload,
      searching: false,
      selectedTab: tabs.RESULTS,
    };
  }
  
  if (action.type === `${FETCH_FILTERED_LOTS}_PENDING`) {
    return { ...state, searching: true }
  }
  
  if (action.type === `${FETCH_FILTERED_LOTS}_FAILED`) {
    return { ...state, searching: false }
  }

  if (action.type === SET_SELECTED_TAB) {
    return { ...state, selectedTab: action.payload };
  }
  
  if (action.type === SET_FLY_TO_COORDINATES) {
    return {
      ...state,
      flyToCoordinates: {
        coordinates: action.payload,
        timestamp: Date.now(),
      },
    };
  }

  if (action.type === SET_LOT_EXPANDED) {
    const { expanded, lotId } = action.payload;
    return {
      ...state,
      filteredLots: state.filteredLots.map(lot => ({
        ...lot,
        expanded: (lotId === lot._parcel_id) ? expanded : lot.expanded,
      })),
    };
  }
  
  return state;
}

export default rootReducer;
