import * as mapStyles from '../constants/map-styles';
import * as tabs from '../constants/tabs';
import {
  COLLAPSE_ALL_LOTS,
  FETCH_FILTERED_LOTS,
  SET_LOT_EXPANDED,
  SET_MAP,
  SET_MAP_STYLE,
  SET_SELECTED_TAB,
} from "../constants/action-types";

const initialState = {
  filteredLots: [],
  map: null,
  // if you change the initial mapStyle here, you must also change it in the MapBox config which is not in this repo.
  mapStyle: mapStyles.STREET,
  searching: false,
  selectedTab: tabs.SEARCH,
};

function rootReducer (state = initialState, action) {
  if (action.type === COLLAPSE_ALL_LOTS) {
    return {
      ...state,
      filteredLots: state.filteredLots.map(lot => ({
        ...lot,
        expanded: false,
      })),
    };
  }

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
  
  if (action.type === SET_MAP) {
    return {
      ...state,
      map: action.payload,
    };
  }

  if (action.type === SET_MAP_STYLE) {
    return {
      ...state,
      mapStyle: action.payload,
    }
  }

  if (action.type === SET_SELECTED_TAB) {
    return { ...state, selectedTab: action.payload };
  }
  
  return state;
}

export default rootReducer;
