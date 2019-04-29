import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { all, call, put, select, race, take, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { HNPost } from './reducer';
import { hasPost } from './selectors';
import {
  Actions,
  fetchPostsError,
  receivePosts,
  startAutoRefresh,
  fetchPosts as fetchPostsAction,
  stopAutoRefresh,
} from './actions';
import { AnyAction } from 'redux';

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

function* feedRefresh({ payload }: ActionType<typeof startAutoRefresh>) {
  const { refreshId } = payload;

  const chan: EventChannel<boolean> = yield call(refreshChan, payload.interval);
  while (true) {
    const { cancel } = yield race({
      refreshTick: take(chan),
      cancel: take((action: AnyAction|ActionType<typeof stopAutoRefresh>) =>
        action.type === Actions.StopAutoRefresh
        && action.payload.refreshId === refreshId,
      ),
    });

    if (cancel) {
      chan.close();
      break;
    }

    yield put(fetchPostsAction(payload.feed, payload.pullSize));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield takeEvery(Actions.FetchPosts, fetchPosts);
}
