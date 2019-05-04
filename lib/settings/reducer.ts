import { FeedType, FeedPanelSettings, WeatherLocation, WeatherLocationType } from './interface';
import { Actions, SettingsAction } from './actions';
import { FeedType as HNFeedType } from '../hn/interface';

export interface FeedSettings {
  readonly refreshInterval: number; // the refresh interval for all panels in minutes
  readonly pullSize: number;
}

export interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: FeedPanelSettings;
}

export interface WeatherSettings {
  readonly openWeatherAPIKey: string;
  readonly location: Readonly<WeatherLocation>;
}

export interface State {
  readonly toast: string;
  readonly feed: FeedSettings;
  readonly panelConfig: {
    readonly left: PanelSettings;
    readonly right: PanelSettings;
  };
  readonly weather: WeatherSettings;
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
  weather: {
    openWeatherAPIKey: '',
    location: {
      type: WeatherLocationType.CityName,
      value: 'Kansas City',
      countryCode: 'US',
      displayName: 'KC',
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
  case Actions.UpdatePanelType: {
    const panelFeedSettings = state.panelConfig[action.meta.panel].type === action.payload
      ? state.panelConfig[action.meta.panel]
      : {};

    return { ...state, panelConfig: { ...state.panelConfig,
      [action.meta.panel]: { type: action.payload, feedSettings: panelFeedSettings },
    }};
  }
  case Actions.UpdatePanelConfiguration:
    return { ...state, panelConfig: { ...state.panelConfig,
      [action.meta.panel]: {
        ...state.panelConfig[action.meta.panel],
        feedSettings: {
          ...state.panelConfig[action.meta.panel].feedSettings,
          ...action.payload.update,
        },
      },
    }};
  default:
    return state;
  }
}
