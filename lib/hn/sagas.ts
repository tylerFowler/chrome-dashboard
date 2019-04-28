import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { all, call, put, select, race, take, takeEvery } from 'redux-saga/effects';
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
import { hasPost } from './selectors';

function* fetchPosts(action: ActionType<typeof fetchPostsAction>) {
  const { feed } = action.payload;

  try {
    // TODO: pull the preferred feed size number here, from settings state
    const postIds = (yield call(API.fetchStoryPage, feed) as unknown) as API.PostId[];

    const postRequests = postIds
      .filter(postId => select((state, id) => hasPost(id, state), postId))
      .map(postId => call(API.fetchStory, postId));

    const posts: ReadonlyArray<HNPost> = yield all(postRequests);

    yield put(receivePosts(feed, posts));
  } catch (error) {
    yield put(fetchPostsError(feed, error));
  }
}

function refreshChan(intervalMs: number) {
  return eventChannel(publish => {
    const id = setInterval(() => publish(true), intervalMs);
    return () => clearInterval(id);
  }, buffers.none());
}

// TODO: for another day - if we have two HN feed panels on the same page then
// their stop autorefreshes will interfere with each other, so we'll probably
// need to pass an ID to startAutoRefresh and use a take pattern that routes
// the stop command to the saga w/ that ID
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
  yield takeEvery(Actions.FetchPosts, fetchPosts);
}
