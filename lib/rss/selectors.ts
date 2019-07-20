import { GlobalState } from '../store';

type State = Pick<GlobalState, 'rssFeed'>;

export const hasFeed = (url: string, { rssFeed }: State) =>
  rssFeed.channels.hasOwnProperty(url);

export const getItemsForFeed = (url: string, { rssFeed }: State) =>
  hasFeed(url, {rssFeed}) && rssFeed.channels[url].items;

export const getFeedRefreshError = (url: string, { rssFeed }: State) =>
  hasFeed(url, {rssFeed}) && rssFeed.channels[url].pullError;

export const isFetchingFeed = (url: string, { rssFeed }: State) =>
  hasFeed(url, {rssFeed}) && rssFeed.channels[url].fetching;
