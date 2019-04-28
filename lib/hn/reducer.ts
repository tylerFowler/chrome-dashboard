import { combineReducers } from 'redux';
import { Actions, HNAction } from './actions';
import { FeedType } from './interface';
import { PostId } from './api';

export interface HNPost {
  readonly id: number;
  readonly title: string;
  readonly time: number;
  readonly author: string;
  readonly url: string;
  readonly hnLink: string;
  readonly score: number;
  readonly commentCount: number;
}

export interface PageEntry {
  readonly posts: ReadonlySet<PostId>;
  readonly fetching: boolean;
  readonly pullError: Error;
}

interface Posts { [id: number]: HNPost; }
type Feeds = { [pageType in FeedType]?: PageEntry };

export interface State {
  posts: Posts;
  feeds: Feeds;
}
export const defaultState: State = { posts: {}, feeds: {} };

function hnPostsReducer(state: Posts = {}, action: HNAction): Posts {
  switch (action.type) {
  case Actions.ReceivePosts:
    return { ...state, ...action.payload.posts
      .reduce((store, p) => ({ ...store, [p.id]: p }), {}),
    };
  default:
    return state;
  }
}

function hnFeedsReducer(state: Feeds = {}, action: HNAction): Feeds {
  switch (action.type) {
  case Actions.FetchPosts:
    return { ...state, [action.payload.feed]: { ...state[action.payload.feed],
      fetching: true, pullError: null,
    }};
  case Actions.FetchPostsFailure:
    return { ...state, [action.payload.feed]: { ...state[action.payload.feed],
      fetching: false, pullError: action.payload.error,
    }};
  case Actions.ReceivePosts:
    return { ...state, [action.payload.feed]: { ...state[action.payload.feed],
      fetching: false, pullError: null,
      posts: new Set(action.payload.posts
        .sort((p1, p2) => p2.time - p1.time)
        .map(post => post.id),
      ),
    }};
  default:
    return state;
  }
}

export default combineReducers({
  posts: hnPostsReducer,
  feeds: hnFeedsReducer,
});
