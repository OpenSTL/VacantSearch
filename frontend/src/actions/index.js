import axios from 'axios'
import * as tabs from '../constants/tabs';

import {
    FETCH_FILTERED_LOTS,
    SET_LOT_EXPANDED,
    SET_MAP,
    SET_SELECTED_TAB,
} from "../constants/action-types";

export const fetchFilteredLots = params => ({
  type: FETCH_FILTERED_LOTS,
  payload: axios.post(process.env.REACT_APP_API_URL, params)
    .then(response => response.data.results),
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
