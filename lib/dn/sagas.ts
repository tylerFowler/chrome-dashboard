import { call, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { DNPost } from './reducer';
import {
  Actions,
  fetchPosts as fetchPostsAction,
  fetchPostsError,
  receivePosts,
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

export default function* rootSaga() {
  yield takeEvery(Actions.FetchPosts, fetchPosts);
}
