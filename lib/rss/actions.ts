import { ActionType } from 'typesafe-actions';

export enum Actions {
  FetchChannel = 'RSS_FETCH_CHAN',
  FetchChannelFailure = 'RSS_FETCH_CHAN_FAILURE',
  RefreshChannel = 'RSS_CHAN_REFRESH',
}

export type RSSAction = ActionType<any>;
