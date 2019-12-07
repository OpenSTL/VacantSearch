import axios from 'axios'
import * as tabs from '../constants/tabs';
import mockApiFilterResponse from '../assets/data/mock-api-filter-response.json';
import { mockApiData } from '../utils';

import {
  COLLAPSE_ALL_LOTS,
  FETCH_FILTERED_LOTS,
  SCROLL_TO_LOT,
  SET_LOT_EXPANDED,
  SET_MAP,
  SET_MAP_STYLE,
  SET_SELECTED_TAB,
} from "../constants/action-types";

/**
 * collapse all lot results in Results tab
 */
export const collapseAllLots = () => ({
  type: COLLAPSE_ALL_LOTS,
});

export const fetchFilteredLots = (params) => {
  const payload = mockApiData() ? 
    Promise.resolve(mockApiFilterResponse.results) : 
    axios.post(process.env.REACT_APP_API_URL, params)
      .then(response => response.data.results);
  return {
    type: FETCH_FILTERED_LOTS,
    payload,
  };
};

/**
 * scroll to a lot in the result list
 * @param {string} id 
 */
export const scrollToLot = lotId => ({
  type: SCROLL_TO_LOT,
  payload: lotId,
});

/**
 * Expand or contract an individual lot Result in the Results tab
 * @param {string} lotId _parcel_id
 * @param {boolean} expanded 
 */
export const setLotExpanded = (lotId, expanded) => ({
  type: SET_LOT_EXPANDED,
  payload: { expanded, lotId },
});

/**
 * Store ref to central Mapbox for access by other components.
 * TODO: there are probably better ways to expose map access , but I can't think of a good way
 * to allow other components to run repeated, identical calls to the map (flyTo with same parameters)
 * through state alone. I think some components use redux middleware traps to do this.
 * @param {mapboxgl.Map} map
 */
export const setMap = map => ({
  type: SET_MAP,
  payload: map,
});

export const setMapStyle = (style) => ({
  type: SET_MAP_STYLE,
  payload: style,
});

/**
 * Set active sidebar tab
 * @param {string} tab See constants/tabs.js
 */
export function setSelectedTab(tab) {
  if (!Object.values(tabs).includes(tab)) throw new Error(`unknown tab ${tab}`);
  return {
    type: SET_SELECTED_TAB,
    payload: tab,  
  };
}
