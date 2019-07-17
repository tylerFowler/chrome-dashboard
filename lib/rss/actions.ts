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

// TODO: remove name, use URL only
export const fetchRSSFeed = (name: string, feedUrl: string) =>
  action(Actions.FetchChannel, { name, url: feedUrl });

export const populateRSSFeed = (name: string, title: string, items: readonly RSSItem[]) =>
  action(Actions.RefreshChannel, { name, title, items });

  // TODO: remove name, use URL only
export const rssFeedFetchFailure = (name: string, error: Error) =>
  action(Actions.FetchChannelFailure, { name, error });
