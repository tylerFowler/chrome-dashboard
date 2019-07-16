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
      channelName: action.payload.name, channelUrl: action.payload.url,
      fetching: true, pullError: null,
    };
  case Actions.RefreshChannel:
    return { ...state, fetching: false, items: action.payload.items };
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
      [action.payload.name]: chanReducer(state.channels[action.payload.name], action),
    }};
  default:
    return state;
  }
}
