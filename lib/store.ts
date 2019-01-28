import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import clockReducer, { State as ClockState } from './clock/reducer';
import clockSaga from './clock/sagas';
import dnFeedReducer, { State as DNFeedState } from './dn/reducer';
import dnFeedSaga from './dn/sagas';
import hnFeedReducer, { State as HNFeedState } from './hn/reducer';
import hnFeedSaga from './hn/sagas';

declare const ENV: string;

export interface GlobalState {
  clock: ClockState;
  hnFeed: HNFeedState;
  dnFeed: DNFeedState;
}

const saga = createSagaMiddleware();

let middlewareComposer: any;
if (ENV === 'development') {
  middlewareComposer = composeWithDevTools;
} else {
  middlewareComposer = compose;
}

const middleware = [ saga ];

const store = createStore(
  combineReducers({
    clock: clockReducer,
    hnFeed: hnFeedReducer,
    dnFeed: dnFeedReducer,
  }),
  middlewareComposer(applyMiddleware(...middleware)),
);

saga.run(function* appSaga() {
  yield all({
    clock: clockSaga(),
    hnFeed: hnFeedSaga(),
    dnFeed: dnFeedSaga(),
  });
});

export default store;
