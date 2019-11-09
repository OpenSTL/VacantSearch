import axios from 'axios'

import {
    FETCH_FILTERED_LOTS,
    SET_FLY_TO_COORDINATES,
    SET_LOT_EXPANDED,
} from "../constants/action-types";

export const fetchFilteredLots = params => ({
  type: FETCH_FILTERED_LOTS,
  payload: axios.post(process.env.REACT_APP_API_URL, params),
});

/**
 * Tell map to fly to these coordinates
 * @param {Array<Number>} coords Format: [x, y]
 */
export function setFlyToCoordinates(coords) {
  return {
    type: SET_FLY_TO_COORDINATES,
    payload: coords,
  };
}

/**
 * Expand or contract an individual lot Result in the Results tab
 * @param {string} lotId _parcel_id
 * @param {boolean} expanded 
 */
export function setLotExpanded(lotId, expanded) {
  return {
    type: SET_LOT_EXPANDED,
    payload: { expanded, lotId },
  };
};
