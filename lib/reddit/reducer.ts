import { FeedType } from './interface';
import { RedditAction, Actions } from './actions';
import { combineReducers } from 'redux';

// TODO: the subreddit feeds give colors per-post, those could be incorporated somehow
// "link_flair_text_color", "author_flair_background_color"
export interface RedditPost {
  readonly title: string;
  readonly author: string;
  readonly upvotes: number;
  readonly createdAt: Date;
  readonly permalink: string;
}

export interface SubredditFeed {
  readonly sub: string;
  readonly postsById: { [id: string]: RedditPost };
  readonly fetching: boolean;
  readonly pullError: Error;
}

const defaultSubFeed: SubredditFeed = {
  sub: '',
  postsById: {},
  fetching: false,
  pullError: null,
} as const;

interface Subreddits { [subredditFeedKey: string]: SubredditFeed; }

// SubredditFeedKey is a key that can be used to idenfity the combination of a
// subreddit and a specific feed view of that subreddit.
const getSubFeedKey = (sub: string, feed: FeedType) => `${sub}/${feed}`;

function subredditReducer(state: SubredditFeed = defaultSubFeed, action: RedditAction): SubredditFeed {
  return state;
}

function subFeedsReducer(state: Subreddits = {}, action: RedditAction): Subreddits {
  switch (action.type) {
  case Actions.FetchSub:
  case Actions.ReceiveSub:
  case Actions.SubFetchFailure:
    const feedKey = getSubFeedKey(action.meta.sub, action.meta.feed);
    return { ...state, [feedKey]: subredditReducer(state[feedKey], action) };
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
