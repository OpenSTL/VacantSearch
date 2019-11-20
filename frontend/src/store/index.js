import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createScrollMiddleware } from 'react-redux-scroll';
import { reducer as formReducer } from 'redux-form'
import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from '../reducers';

const devMode = process.env.NODE_ENV !== 'production';

const getMiddleware = () => {
  const scrollMiddleware = createScrollMiddleware();
  const common = [
    promiseMiddleware,
    scrollMiddleware,
  ];
  const dev = [
    logger,
  ];
  const prod = [];
  return [...common, ...(devMode ? dev : prod)];
}

const store = createStore(
  combineReducers({
    root: rootReducer,
    form: formReducer,
  }),
  applyMiddleware(...getMiddleware()),
);

export default store;
