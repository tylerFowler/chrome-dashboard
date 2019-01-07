import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import clockReducer, { State as ClockState } from './clock/reducer';
import clockSaga from './clock/sagas';

declare const ENV: string;

export interface GlobalState {
  clock: ClockState;
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
  }),
  middlewareComposer(applyMiddleware(...middleware)),
);

saga.run(function* appSaga() {
  yield all({
    clock: clockSaga(),
  });
});

export default store;
