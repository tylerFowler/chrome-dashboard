import { FeedType } from './interface';
import { Actions, SettingsAction } from './actions';

export interface FeedSettings {
  readonly refreshInterval: number; // the refresh interval for all panels in minutes
  readonly pullSize: number;
}

export interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: object; // TODO: replace w/ specific feed settings
}

export interface State {
  readonly feed: FeedSettings;
  readonly panelConfig: {
    readonly left: PanelSettings;
    readonly right: PanelSettings;
  };
}

export const defaultState: State = {
  feed: {
    refreshInterval: 10,
    pullSize: 10,
  },
  panelConfig: {
    left: { type: FeedType.DN },
    right: { type: FeedType.HN },
  },
};

export default function settingsReducer(state: State = defaultState, action: SettingsAction): State {
  switch (action.type) {
  case Actions.ReceiveSettings:
    return action.payload;
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
