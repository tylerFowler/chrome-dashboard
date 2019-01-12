import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Actions, fetchPostsError, receivePosts } from './actions';
import { HNPost } from './reducer';

const HNApi = 'https://hacker-news.firebaseio.com/v0';

export enum PageType {
  TopStories = 'topstories',
  NewStories = 'newstories',
  BestStories = 'beststories',
  ShowStories = 'showstories',
}

type PostId = number;
async function fetchStoryPage(type: PageType = PageType.NewStories, size: number = 10): Promise<PostId[]> {
  const response = await fetch(`${HNApi}/${type}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const ids = await response.json() as PostId[];
  return ids.slice(0, size);
}

interface FetchStoryResponse {
  readonly id: number;
  readonly deleted: boolean;
  readonly type: 'job'|'story'|'comment'|'poll'|'pollopt';
  readonly by: string;
  readonly time: number;
  readonly text: string;
  readonly dead: boolean;
  readonly parent?: PostId;
  readonly poll?: string;
  readonly kids: PostId[];
  readonly url: string;
  readonly score?: number;
  readonly title: string;
  readonly parts?: PostId[];
  readonly descendants?: number;
}

async function fetchStory(id: PostId): Promise<Readonly<HNPost>> {
  const response = await fetch(`${HNApi}/item/${id}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const story = await response.json() as FetchStoryResponse;
  return {
    id: story.id,
    title: story.title,
    time: story.time,
    author: story.by,
    url: story.url,
    score: story.score,
    commentCount: story.descendants || -1,
  } as HNPost;
}

function* fetchPosts() {
  try {
    const postIds = (yield call(fetchStoryPage) as unknown) as PostId[];

    const postRequests = postIds.map(postId => call(fetchStory, postId));
    const posts: ReadonlyArray<HNPost> = yield all(postRequests);

    yield put(receivePosts(posts));
  } catch (error) {
    yield put(fetchPostsError(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(Actions.FetchPosts, fetchPosts);
}
