import { FeedType } from './interface';
import { RedditAction, Actions } from './actions';

// TODO: the subreddit feeds give colors per-post, those could be incorporated somehow
// "link_flair_text_color", "author_flair_background_color"
export interface RedditPost {
  readonly title: string;
  readonly author: string;
  readonly upvotes: number;
  readonly createdAt: Date;
  readonly permalink: string;
}

export interface Subreddit {
  readonly name: string;
  readonly postsByFeedType: { [feed in FeedType]?: readonly RedditPost[] };
  readonly fetching: boolean;
  readonly pullError: Error;
}

export interface State {
  readonly subs: { [subreddit: string]: Subreddit };
}

const defaultState: State = { subs: {} } as const;

export default function redditReducer(state: State = defaultState, action: RedditAction): State {
  switch (action.type) {
  case Actions.FetchSub:
  case Actions.ReceiveSub:
  case Actions.SubFetchFailure:
  default:
    return state;
  }
}
