import { RSSItem } from './interface';
import { RSSAction } from './actions';

export interface FeedChannel {
  readonly channelName: string;
  readonly fetching: string;
  readonly pullError: Error;
  readonly items: readonly RSSItem[];
}

export interface State {
  readonly channels: { [chanName: string]: FeedChannel };
}

const defaultState: State = {
  channels: {},
} as const;

export default function rssReducer(state: State = defaultState, action: RSSAction): State {
  switch (action.type) {
  default:
    return state;
  }
}
