import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from '../reducers';

const store = createStore(
  combineReducers({
    root: rootReducer,
    form: formReducer,
  }),
  applyMiddleware(logger, promiseMiddleware)
);

export default store;
