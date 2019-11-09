import axios from 'axios'
import * as tabs from '../constants/tabs';

import {
    FETCH_FILTERED_LOTS,
    SET_FLY_TO_COORDINATES,
    SET_LOT_EXPANDED,
    SET_SELECTED_TAB,
} from "../constants/action-types";

export const fetchFilteredLots = params => ({
  type: FETCH_FILTERED_LOTS,
  payload: axios.post(process.env.REACT_APP_API_URL, params)
    .then(response => response.data.results),
});

/**
 * Tell map to fly to these coordinates
 * @param {Array<Number>} coords Format: [x, y]
 */
export const setFlyToCoordinates = coords => ({
  type: SET_FLY_TO_COORDINATES,
  payload: coords,
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
