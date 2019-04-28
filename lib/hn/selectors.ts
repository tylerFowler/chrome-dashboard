import { GlobalState } from '../store';
import { FeedType } from './interface';
import { PostId } from './api';

type State = Pick<GlobalState, 'hnFeed'>;

export const hasFeed = (feed: FeedType, { hnFeed }: State) => hnFeed.feeds.hasOwnProperty(feed);
export const getFeed = (feed: FeedType, { hnFeed }: State) => hnFeed.feeds[feed];

export const getPost = (id: PostId, { hnFeed }: State) => hnFeed.posts[id];
export const hasPost = (id: PostId, { hnFeed }: State) => hnFeed.posts.hasOwnProperty(id);

export const isLoadingStories = (feed: FeedType, { hnFeed }: State) =>
  hasFeed(feed, {hnFeed}) && getFeed(feed, {hnFeed}).fetching;

export const getFetchError = (feed: FeedType, { hnFeed }: State) =>
  hasFeed(feed, {hnFeed}) && getFeed(feed, {hnFeed}).pullError;

export const getStoryPage = (feed: FeedType, limit: number, { hnFeed }: State) => {
  if (!hasFeed(feed, {hnFeed})) {
    return [];
  }

  return Array.from(getFeed(feed, {hnFeed}).posts || [])
    .slice(0, limit)
    .map(id => getPost(id, {hnFeed}));
};
