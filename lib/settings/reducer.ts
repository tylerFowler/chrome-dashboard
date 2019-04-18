import { FeedType, FeedPanelSettings } from './interface';
import { Actions, SettingsAction } from './actions';
import { PageType as HNFeedType } from '../hn/interface';

export interface FeedSettings {
  readonly refreshInterval: number; // the refresh interval for all panels in minutes
  readonly pullSize: number;
}

export interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: FeedPanelSettings;
}

export interface State {
  readonly toast: string;
  readonly feed: FeedSettings;
  readonly panelConfig: {
    readonly left: PanelSettings;
    readonly right: PanelSettings;
  };
}

export const defaultState: State = {
  toast: null,
  feed: {
    refreshInterval: 10,
    pullSize: 10,
  },
  panelConfig: {
    left: { type: FeedType.DN },
    right: {
      type: FeedType.HN,
      feedSettings: { defaultFeedType: HNFeedType.TopStories },
    },
  },
};

export default function settingsReducer(state: State = defaultState, action: SettingsAction): State {
  switch (action.type) {
  case Actions.AddToast:
    return { ...state, toast: action.payload.content };
  case Actions.RemoveToast:
    return { ...state, toast: null };
  case Actions.ReceiveSettings:
    return { ...state, ...action.payload };
  case Actions.UpdateFeedConfiguration:
    return { ...state, feed: { ...state.feed, ...action.payload.update } };
  case Actions.UpdatePanelConfiguration:
    return { ...state, panelConfig: { ...state.panelConfig,
      [action.meta.panel]: {
        ...state.panelConfig[action.meta.panel],
        ...action.payload.update,
      },
    }};
  default:
    return state;
  }
}
