import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { all, call, put, select, race, take, takeEvery, takeLeading } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { HNPost } from './reducer';
import { Actions as SettingActions } from '../settings/actions';
import { hasPost, getActiveFeeds } from './selectors';
import { getFeedPullSize } from '../settings/selectors';
import {
  Actions,
  fetchPostsError,
  receivePosts,
  startAutoRefresh,
  fetchPosts as fetchPostsAction,
} from './actions';
import { FeedType } from './interface';

function* fetchPosts(action: ActionType<typeof fetchPostsAction>) {
  const { feed, pullSize } = action.payload;

  try {
    const postIds = (yield call(API.fetchStoryPage, feed, pullSize) as unknown) as API.PostId[];

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

    yield call(fetchPosts, fetchPostsAction(payload.feed, payload.pullSize));
  }
}

function* refreshAllFeeds() {
  const pullSize = yield select(getFeedPullSize);
  const activeFeeds: readonly FeedType[] = yield select(getActiveFeeds);

  yield all(
    activeFeeds.map(feed => put(fetchPostsAction(feed, pullSize))),
  );
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield takeEvery(Actions.FetchPosts, fetchPosts);
  yield takeLeading(SettingActions.RefreshFeeds, refreshAllFeeds);
}
