import { RSSItem } from './interface';
import { RSSAction, Actions } from './actions';

export interface FeedChannel {
  readonly channelName: string;
  readonly channelUrl: string;
  readonly fetching: boolean;
  readonly pullError: Error;
  readonly items: readonly RSSItem[];
}

const defaultChannel: FeedChannel = {
  channelName: '',
  channelUrl: '',
  fetching: false,
  pullError: null,
  items: [],
} as const;

// TODO: we may need to key this map by url to have stable identifiers
export interface State {
  readonly channels: { [channel: string]: FeedChannel };
}

const defaultState: State = {
  channels: {},
} as const;

const chanReducer = (state: FeedChannel = defaultChannel, action: RSSAction): FeedChannel => {
  switch (action.type) {
  case Actions.FetchChannel:
    return { ...state,
      channelUrl: action.payload.feedUrl,
      fetching: true, pullError: null,
    };
  case Actions.RefreshChannel:
    return { ...state, fetching: false, channelName: action.payload.title,
      items: Array.from(action.payload.items)
        .sort((a, b) => a.publishDate.valueOf() - b.publishDate.valueOf()),
    };
  case Actions.FetchChannelFailure:
    return { ...state, fetching: false, pullError: action.payload.error };
  default:
    return state;
  }
};

export default function rssReducer(state: State = defaultState, action: RSSAction): State {
  switch (action.type) {
  case Actions.FetchChannel:
  case Actions.FetchChannelFailure:
  case Actions.RefreshChannel:
    return { ...state, channels: { ...state.channels,
      [action.payload.feedUrl]: chanReducer(state.channels[action.payload.feedUrl], action),
    }};
  default:
    return state;
  }
}
