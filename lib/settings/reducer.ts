import { FeedType, FeedPanelSettings } from './interface';
import { WeatherLocation, WeatherLocationType } from '../weather/interface';
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
  readonly unit: 'F'|'C';
  readonly location: Readonly<WeatherLocation>;
}

export interface State {
  readonly toast: string;
  readonly storageError: Error;
  readonly feed: FeedSettings;
  readonly panelConfig: {
    readonly left: PanelSettings;
    readonly right: PanelSettings;
  };
  readonly weather: WeatherSettings;
}

export const defaultState: State = {
  toast: null,
  storageError: null,
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
  weather: { unit: 'F', location: {
    type: WeatherLocationType.CityName,
    value: '',
  }},
};

// TODO: this would be better off as several separate reducers w/ a single
// combineReducer at the top
export default function settingsReducer(state: State = defaultState, action: SettingsAction): State {
  switch (action.type) {
  case Actions.AddToast:
    return { ...state, toast: action.payload.content };
  case Actions.RemoveToast:
    return { ...state, toast: null };
  case Actions.ReceiveSettings:
    return { ...state, ...action.payload, storageError: null };
  case Actions.Committed:
    return { ...state, storageError: null };
  case Actions.CommitFailure:
  case Actions.RestoreFailure:
    return { ...state, storageError: action.payload.error };
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
  case Actions.UpdateWeatherConfiguration:
    return { ...state, weather: { ...state.weather, ...action.payload.update }};
  default:
    return state;
  }
}
