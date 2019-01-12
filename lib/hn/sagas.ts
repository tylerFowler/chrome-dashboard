import { call, put, takeLatest } from 'redux-saga/effects';
import { Actions, fetchPostsError } from './actions';

const HNApi = 'https://hacker-news.firebaseio.com/v0';

export enum PageType {
  TopStories = 'topstories',
  NewStories = 'newstories',
  BestStories = 'beststories',
}

type PostId = number;

async function fetchStoryPage(type: PageType = PageType.NewStories, size: number = 10): Promise<PostId[]> {
  return Promise.reject('not implemented');
}

function* fetchPosts() {
  try {
    const pageIds = yield call(fetchStoryPage);
    console.log('page ids are', pageIds);
  } catch (error) {
    yield put(fetchPostsError(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(Actions.FetchPosts, fetchPosts);
}
