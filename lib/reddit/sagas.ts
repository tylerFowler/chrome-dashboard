import { AnyAction } from 'redux';
import { ActionType } from 'typesafe-actions';
import { race, take, takeEvery, debounce, put, call } from 'redux-saga/effects';
import { buffers, EventChannel, eventChannel } from 'redux-saga';
import * as API from './api';
import { RedditPost } from './interface';
import {
  Actions, fetchSubreddit as fetchSubredditAction, fetchSubredditError,
  refreshSubreddit, startAutoRefresh, stopAutoRefresh,
} from './actions';

function* fetchSubreddit(action: ActionType<typeof fetchSubredditAction>) {
  const { sub, feed } = action.meta;

  try {
    const subPosts: RedditPost[] = yield call(API.fetchSubreddit, sub, feed, action.payload.pullSize);
    yield put(refreshSubreddit(sub, feed, subPosts));
  } catch (error) {
    yield put(fetchSubredditError(sub, feed, error));
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

    yield put(fetchSubredditAction(payload.sub, payload.feed, payload.pullSize));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.StartAutoRefresh, feedRefresh);
  yield debounce(2500, Actions.FetchSub, fetchSubreddit);
}
