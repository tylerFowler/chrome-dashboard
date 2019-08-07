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
import redditFeedReducer, { State as RedditFeedState } from './reddit/reducer';
import redditFeedSaga from './reddit/sagas';
import settingsReducer, { State as SettingsState } from './settings/reducer';
import settingsSaga from './settings/sagas';
import weatherReducer, { State as WeatherState } from './weather/reducer';
import weatherSaga from './weather/sagas';

declare const ENV: string;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/apiCacheWorker.js', { scope: './' })
    .then(reg => console.log('Registration succeeded', reg))
    .catch(err => console.error('Registration failed', err));
}

export interface GlobalState {
  clock: ClockState;
  hnFeed: HNFeedState;
  dnFeed: DNFeedState;
  redditFeed: RedditFeedState;
  weather: WeatherState;
  settings: SettingsState;
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
    redditFeed: redditFeedReducer,
    weather: weatherReducer,
    settings: settingsReducer,
  }),
  middlewareComposer(applyMiddleware(...middleware)),
);

saga.run(function* appSaga() {
  yield all({
    settings: settingsSaga(),
    clock: clockSaga(),
    hnFeed: hnFeedSaga(),
    dnFeed: dnFeedSaga(),
    redditFeed: redditFeedSaga(),
    weather: weatherSaga(),
  });
});

export default store;
