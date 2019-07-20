import { call, put, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { fetchRSSFeed, rssFeedFetchFailure, Actions, populateRSSFeed } from './actions';
import * as API from './api';

function* refreshRSSFeed(action: ActionType<typeof fetchRSSFeed>) {
  const { feedUrl: url, maxItems } = action.payload;

  try {
    const rssChannel: API.RSSFeedChannel = yield call(API.refreshRSSFeed, url, maxItems);

    yield put(populateRSSFeed(url, rssChannel.title, rssChannel.items));
  } catch (error) {
    yield put(rssFeedFetchFailure(url, error));
  }
}

export default function* rootSaga() {
  yield takeLatest(Actions.FetchChannel, refreshRSSFeed);
}
