import { Actions, DNAction } from './actions';

// TODO consider adding badges (as tags) to feed items
export interface DNPost {
  readonly id: string;
  readonly title: string;
  readonly time: Date;
  readonly author: string;
  readonly url: string;
  readonly dnLink: string;
  readonly voteCount: number;
  readonly commentCount: number;
}

export interface State {
  readonly posts: { [id: string]: DNPost };
  readonly pullError: Error;
  readonly fetching: boolean;
}

export const defaultState: State = {
  posts: {},
  pullError: null,
  fetching: false,
};

export default function dnFeedReducer(state: State = defaultState, action: DNAction): State {
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
