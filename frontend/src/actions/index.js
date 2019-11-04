import { SET_FILTERED_LOTS } from "../constants/action-types";

export function setFilteredLots(payload) {
  return {
    type: SET_FILTERED_LOTS,
    payload,
  };
};
