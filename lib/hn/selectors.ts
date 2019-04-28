import { GlobalState } from '../store';
import { PageType } from './interface';
import { PostId } from './api';

type State = Pick<GlobalState, 'hnFeed'>;

export const hasFeed = (feed: PageType, { hnFeed }: State) => hnFeed.feeds.hasOwnProperty(feed);
export const getFeed = (feed: PageType, { hnFeed }: State) => hnFeed.feeds[feed];

export const getPost = (id: PostId, { hnFeed }: State) => hnFeed.posts[id];

export const isLoadingStories = (feed: PageType, { hnFeed }: State) =>
  hasFeed(feed, {hnFeed}) && getFeed(feed, {hnFeed}).fetching;

export const getFetchError = (feed: PageType, { hnFeed }: State) =>
  hasFeed(feed, {hnFeed}) && getFeed(feed, {hnFeed}).pullError;

export const getStoryPage = (feed: PageType, limit: number, { hnFeed }: State) =>
  Array.from(getFeed(feed, {hnFeed}).posts || [])
    .slice(0, limit)
    .map(id => getPost(id, {hnFeed}));
