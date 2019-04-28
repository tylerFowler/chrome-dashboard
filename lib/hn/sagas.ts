import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { all, call, put, race, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { HNPost } from './reducer';
import {
  Actions,
  fetchPostsError,
  receivePosts,
  startAutoRefresh,
  fetchPosts as fetchPostsAction,
} from './actions';

function* fetchPosts(action: ActionType<typeof fetchPostsAction>) {
  try {
    // TODO: pull the preferred feed size number here, from settings state
    const postIds = (yield call(API.fetchStoryPage, action.payload.feed) as unknown) as API.PostId[];

    const postRequests = postIds.map(postId => call(API.fetchStory, postId));
    const posts: ReadonlyArray<HNPost> = yield all(postRequests);

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
  const chan: EventChannel<boolean> = yield call(refreshChan, payload.interval);
  while (true) {
    const { cancel } = yield race({
      refreshTick: take(chan),
      cancel: take(Actions.StopAutoRefresh),
    });

    if (cancel) {
      chan.close();
      break;
    }

    yield call(fetchPosts, fetchPostsAction(payload.feed));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield takeLatest(Actions.FetchPosts, fetchPosts);
}
