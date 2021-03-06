import { RedditPost, FeedType } from './interface';
import { RedditAction, Actions } from './actions';
import { combineReducers } from 'redux';

export interface SubredditFeed {
  readonly sub: string;
  readonly posts: readonly RedditPost[];
  readonly fetching: boolean;
  readonly pullError: Error;
}

const defaultSubFeed: SubredditFeed = {
  sub: '',
  posts: [],
  fetching: false,
  pullError: null,
} as const;

interface Subreddits { [subredditFeedKey: string]: SubredditFeed; }

// SubredditFeedKey is a key that can be used to idenfity the combination of a
// subreddit and a specific feed view of that subreddit.
export const getSubFeedKey = (sub: string, feed: FeedType) => `${sub}/${feed}`;

function subredditReducer(state: SubredditFeed = defaultSubFeed, action: RedditAction): SubredditFeed {
  switch (action.type) {
  case Actions.FetchSub:
    return { ...state, fetching: true, pullError: null };
  case Actions.ReceiveSub:
    return { ...state, fetching: false, posts: action.payload.posts };
  case Actions.SubFetchFailure:
    return { ...state, fetching: false, pullError: action.payload.error };
  default:
    return state;
  }
}

function subFeedsReducer(state: Subreddits = {}, action: RedditAction): Subreddits {
  switch (action.type) {
  case Actions.FetchSub:
  case Actions.ReceiveSub:
  case Actions.SubFetchFailure:
    const feedKey = getSubFeedKey(action.meta.sub, action.meta.feed);
    return { ...state, [feedKey]: {
      sub: action.meta.sub, ...subredditReducer(state[feedKey], action),
    }};
  default:
    return state;
  }
}

export interface State {
  readonly subFeeds: Subreddits;
}

export default combineReducers({
  subFeeds: subFeedsReducer,
});
