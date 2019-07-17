import { call, put, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { fetchRSSFeed, rssFeedFetchFailure, Actions, populateRSSFeed } from './actions';
import * as API from './api';

function* refreshRSSFeed(action: ActionType<typeof fetchRSSFeed>) {
  const { name, url } = action.payload;

  try {
    const rssChannel: API.RSSFeedChannel = yield call(API.refreshRSSFeed, url);

    yield put(populateRSSFeed(name, rssChannel.title, rssChannel.items));
  } catch (error) {
    yield put(rssFeedFetchFailure(name, error));
  }
}

export default function* rootSaga() {
  yield takeLatest(Actions.FetchChannel, refreshRSSFeed);
}
