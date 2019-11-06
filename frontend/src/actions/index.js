import axios from 'axios'

import {
  FETCH_FILTERED_LOTS,
} from "../constants/action-types";

export const fetchFilteredLots = params => ({
  type: FETCH_FILTERED_LOTS,
  payload: axios.post(process.env.REACT_APP_API_URL, params),
});
