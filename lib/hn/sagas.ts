import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { HNPost } from './reducer';
import { hasPost } from './selectors';
import {
  Actions,
  fetchPostsError,
  receivePosts,
  fetchPosts as fetchPostsAction,
} from './actions';

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

export default function* rootSaga() {
  yield takeEvery(Actions.FetchPosts, fetchPosts);
}
