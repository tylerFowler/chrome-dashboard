import { Actions, HNAction } from './actions';

export interface HNPost {
  readonly id: number;
  readonly title: string;
  readonly time: number;
  readonly author: string;
  readonly url: string;
  readonly score: number;
  readonly commentCount: number;
}

export interface State {
  readonly posts: { [id: number]: HNPost };
  readonly pullError: Error;
  readonly fetching: boolean;
}

export const defaultState: State = {
  posts: {},
  pullError: null,
  fetching: false,
};

export default function hnFeedReducer(state: State = defaultState, action: HNAction): State {
  switch (action.type) {
  case Actions.FetchPosts:
    return { ...state, fetching: true };
  case Actions.FetchPostsFailure:
    return { ...state, pullError: action.payload.error, fetching: false };
  case Actions.ReceivePosts:
    return { ...state, pullError: null, fetching: false, posts:
      action.payload.posts.reduce((store, p) => ({ ...store, [p.id]: p }), {}),
    };
  default:
    return state;
  }
}
