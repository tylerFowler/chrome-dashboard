import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { all, call, put, race, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { Actions, fetchPostsError, receivePosts, startAutoRefresh } from './actions';
import * as API from './api';
import { PostId } from './api';
import { HNPost } from './reducer';

function* fetchPosts() {
  try {
    const postIds = (yield call(API.fetchStoryPage) as unknown) as PostId[];

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

    yield call(fetchPosts);
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield takeLatest(Actions.FetchPosts, fetchPosts);
}
