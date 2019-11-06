import { SET_FLY_TO_COORDINATES, SET_FILTERED_LOTS } from "../constants/action-types";

export function setFilteredLots(payload) {
  return {
    type: SET_FILTERED_LOTS,
    payload,
  };
};

// [x, y]
export function setFlyToCoordinates(coords) {
  return {
    type: SET_FLY_TO_COORDINATES,
    payload: coords,
  };
}
