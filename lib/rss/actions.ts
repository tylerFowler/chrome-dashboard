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
  action(Actions.FetchChannel, { feedUrl });

export const populateRSSFeed = (feedUrl: string, title: string, items: readonly RSSItem[]) =>
  action(Actions.RefreshChannel, { feedUrl, title, items });

export const rssFeedFetchFailure = (feedUrl: string, error: Error) =>
  action(Actions.FetchChannelFailure, { feedUrl, error });
