import { combineReducers } from 'redux';
import { FeedType, FeedPanelSettings } from './interface';
import { WeatherLocation, WeatherLocationType } from '../weather/interface';
import { Actions, SettingsAction } from './actions';
import { FeedType as HNFeedType } from '../hn/interface';

const defaultToastState: string = null;

function toastReducer(state = defaultToastState, action: SettingsAction): string {
  switch (action.type) {
  case Actions.AddToast:
    return action.payload.content;
  case Actions.RemoveToast:
    return null;
  default:
    return state;
  }
}

export interface StorageMeta {
  readonly storageError: Error;
  readonly hasStoredSettings: boolean;
  readonly restorationCompleted: boolean;
}

const defaultStorageMetaState: StorageMeta = {
  storageError: null,
  hasStoredSettings: false,
  restorationCompleted: false,
} as const;

function storageMetaReducer(state = defaultStorageMetaState, action: SettingsAction): StorageMeta {
  switch (action.type) {
  case Actions.ReceiveSettings:
    return { ...state, storageError: null, hasStoredSettings: true };
  case Actions.Committed:
    return { ...state, storageError: null };
  case Actions.CommitFailure:
    return { ...state,  storageError: action.payload.error };
  case Actions.RestoreSuccess:
    return { ...state, restorationCompleted: true };
  case Actions.RestoreFailure:
    return { ...state,  storageError: action.payload.error, restorationCompleted: true };
  default:
    return state;
  }
}

export interface FeedSettings {
  readonly refreshInterval: number; // the refresh interval for all panels in minutes
  readonly pullSize: number;
}

const defaultFeedState: FeedSettings = {
  refreshInterval: 10,
  pullSize: 10,
} as const;

function feedReducer(state = defaultFeedState, action: SettingsAction): FeedSettings {
  switch (action.type) {
  case Actions.ReceiveSettings:
    return { ...state, ...action.payload.feed };
  case Actions.UpdateFeedConfiguration:
    return { ...state, ...action.payload.update };
  default:
    return state;
  }
}

export interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: FeedPanelSettings;
}

export interface PanelConfig {
  readonly left: PanelSettings;
  readonly right: PanelSettings;
}

const defaultPanelState: PanelConfig = {
  left: { type: FeedType.DN },
  right: {
    type: FeedType.HN,
    feedSettings: { defaultFeedType: HNFeedType.TopStories },
  },
} as const;

function panelReducer(state = defaultPanelState, action: SettingsAction): PanelConfig {
  switch (action.type) {
  case Actions.ReceiveSettings:
    return { ...state, ...action.payload.panelConfig };
  case Actions.UpdatePanelType: {
    // if the type hasn't changed, reuse any existing configuration
    const panelFeedSettings = state[action.meta.panel].type === action.payload
      ? state[action.meta.panel]
      : {};

    return { ...state,
      [action.meta.panel]: { type: action.payload, feedSettings: panelFeedSettings },
    };
  }
  case Actions.UpdatePanelConfiguration:
    return { ...state,
      [action.meta.panel]: {
        ...state[action.meta.panel],
        feedSettings: {
          ...state[action.meta.panel].feedSettings,
          ...action.payload.update,
        },
      },
    };
  default:
    return state;
  }
}

export interface WeatherSettings {
  readonly unit: 'F'|'C';
  readonly refreshingLocation: boolean;
  readonly locationRefreshError: Error;
  readonly location: Readonly<WeatherLocation>;
}

const defaultWeatherState: WeatherSettings = {
  unit: 'F',
  refreshingLocation: false, // TODO: how do we handle this in serialization?
  locationRefreshError: null,
  location: {
    type: WeatherLocationType.Current,
    value: { lat: '', lon: '' },
  },
} as const;

function weatherReducer(state = defaultWeatherState, action: SettingsAction): WeatherSettings {
  switch (action.type) {
  case Actions.ReceiveSettings:
    return { ...state, ...action.payload.weather,
      refreshingLocation: false, locationRefreshError: null,
    };
  case Actions.UpdateWeatherConfiguration:
    return { ...state, ...action.payload.update };
  case Actions.RefreshWeatherCoordinates:
    return { ...state, refreshingLocation: true, locationRefreshError: null };
  case Actions.RefreshWeatherCoordinatesSuccess:
    return { ...state, refreshingLocation: false };
  case Actions.RefreshWeatherCoordinatesFailure:
    return { ...state, refreshingLocation: false, locationRefreshError: action.payload.error };
  default:
    return state;
  }
}

export interface State {
  readonly toast: string;
  readonly storageMeta: StorageMeta;
  readonly feed: FeedSettings;
  readonly panelConfig: PanelConfig;
  readonly weather: WeatherSettings;
}

export const defaultState: State = {
  toast: defaultToastState,
  storageMeta: defaultStorageMetaState,
  feed: defaultFeedState,
  panelConfig: defaultPanelState,
  weather: defaultWeatherState,
};

export default combineReducers({
  toast: toastReducer,
  storageMeta: storageMetaReducer,
  feed: feedReducer,
  panelConfig: panelReducer,
  weather: weatherReducer,
});
