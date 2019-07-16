import { action, ActionType } from 'typesafe-actions';
import { RSSItem } from './interface';

export enum Actions {
  FetchChannel = 'RSS_FETCH_CHAN',
  FetchChannelFailure = 'RSS_FETCH_CHAN_FAILURE',
  RefreshChannel = 'RSS_CHAN_REFRESH',
}

export type RSSAction = ActionType<
  | typeof fetchRSSFeed
  | typeof populateRSSFeed
  | typeof rssFeedFetchFailure
>;

export const fetchRSSFeed = (feedUrl: string) =>
  action(Actions.FetchChannel, { url: feedUrl });

export const populateRSSFeed = (feedUrl: string, items: readonly RSSItem[]) =>
  action(Actions.RefreshChannel, { url: feedUrl, items });

export const rssFeedFetchFailure = (feedUrl: string, error: Error) =>
  action(Actions.FetchChannelFailure, { url: feedUrl, error });
