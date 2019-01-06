import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

declare const ENV: string;

export interface GlobalState {
  placeholder: {};
}

const defaultReducer = (state: GlobalState) => state;

const saga = createSagaMiddleware();

let middlewareComposer: any;
if (ENV === 'development') {
  // tslint:disable-next-line
  middlewareComposer = composeWithDevTools;
} else {
  middlewareComposer = compose;
}

const middleware = [ saga ];

const store = createStore(defaultReducer, middlewareComposer(applyMiddleware(...middleware)));

export default store;
