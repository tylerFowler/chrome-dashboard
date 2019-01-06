import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

declare const ENV: string;

export interface GlobalState {
  placeholder: {};
}

const defaultReducer = (state: GlobalState) => state;

const saga = createSagaMiddleware();

let middlewareComposer: typeof compose;
if (ENV === 'development') {
  // tslint:disable-next-line
  const composeWithDevTools = require('redux-devtools-extension');
  middlewareComposer = composeWithDevTools;
} else {
  middlewareComposer = compose;
}

const middleware = [ saga ];

const store = createStore(defaultReducer, middlewareComposer(applyMiddleware(...middleware)));

export default store;
