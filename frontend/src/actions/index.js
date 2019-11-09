import axios from 'axios'

import {
    FETCH_FILTERED_LOTS,
    SET_FLY_TO_COORDINATES,
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
};
