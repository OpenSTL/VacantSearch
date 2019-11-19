import { createStore, applyMiddleware } from 'redux';
import { createScrollMiddleware } from 'react-redux-scroll';
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
  rootReducer,
  applyMiddleware(...getMiddleware()),
);

export default store;
