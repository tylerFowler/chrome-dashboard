import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Actions, fetchPostsError, receivePosts } from './actions';
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

export default function* rootSaga() {
  yield takeLatest(Actions.FetchPosts, fetchPosts);
}
