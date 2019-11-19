import { createStore, applyMiddleware } from 'redux';
import { createScrollMiddleware } from 'react-redux-scroll';
import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from '../reducers';

const getMiddleware = () => {
  const scrollMiddleware = createScrollMiddleware();
  return [
    logger,
    promiseMiddleware,
    scrollMiddleware,
  ];
}

const store = createStore(
  rootReducer,
  applyMiddleware(...getMiddleware()),
);

export default store;
