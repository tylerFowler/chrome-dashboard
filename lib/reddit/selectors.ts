import { GlobalState } from '../store';
import { FeedType } from './interface';
import { getSubFeedKey } from './reducer';

type State = Pick<GlobalState, 'redditFeed'>;

const getSubFeed = (subreddit: string, feedType: FeedType, { redditFeed }: State) =>
  redditFeed.subFeeds[getSubFeedKey(subreddit, feedType)];

export const getPostsForSub = (subreddit: string, feedType: FeedType, maxResults: number, { redditFeed }: State) => {
  const subFeed = getSubFeed(subreddit, feedType, { redditFeed });
  if (!subFeed) {
    return [];
  }

  return subFeed.posts.slice(0, maxResults);
};

export const isFetchingSub = (subreddit: string, feedType: FeedType, { redditFeed }: State) => {
  const subFeed = getSubFeed(subreddit, feedType, { redditFeed });
  if (!subFeed) {
    return false;
  }

  return subFeed.fetching;
};

export const getSubFetchError = (subreddit: string, feedType: FeedType, { redditFeed }: State) => {
  const subFeed = getSubFeed(subreddit, feedType, { redditFeed });
  if (!subFeed) {
    return null;
  }

  return subFeed.pullError;
};
