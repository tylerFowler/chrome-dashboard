import { buffers, eventChannel } from '@redux-saga/core';
import { call, put, race, take, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { DNPost } from './reducer';
import {
  Actions,
  fetchPosts as fetchPostsAction,
  fetchPostsError,
  receivePosts,
  startAutoRefresh,
} from './actions';

function* fetchPosts(action: ActionType<typeof fetchPostsAction>) {
  const { pullSize } = action.payload;

  try {
    const posts: DNPost[] = yield call(API.fetchStoryPage, pullSize);
    yield put(receivePosts(posts));
  } catch (error) {
    yield put(fetchPostsError(error));
  }
}

function refreshChan(intervalMs: number) {
  return eventChannel(publish => {
    const id = setInterval(() => publish(true), intervalMs);
    return () => clearInterval(id);
  }, buffers.none());
}

function* feedRefresh({ payload }: ActionType<typeof startAutoRefresh>) {
  const chan = yield call(refreshChan, payload.interval);
  while (true) {
    const { cancel } = yield race({
      refreshTick: take(chan),
      cancel: take(Actions.StopAutoRefresh),
    });

    if (cancel) {
      chan.close();
      break;
    }

    yield put(fetchPostsAction(payload.pullSize));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield takeEvery(Actions.FetchPosts, fetchPosts);
}
