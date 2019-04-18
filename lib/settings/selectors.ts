import { GlobalState } from '../store';
import { PanelOrientation } from './reducer';

type State = Pick<GlobalState, 'settings'>;

export const getSerializableSettings = ({ settings }: State) => {
  const serializableSettings = { ...settings };
  delete serializableSettings.toast;

  return serializableSettings;
};

export const getActiveToast = ({ settings }: State) => settings.toast;

export const getFeedRefreshInterval = ({ settings }: State) => settings.feed.refreshInterval;

export const getPanelFeedType = (orientation: PanelOrientation, { settings }: State) =>
  settings.panelConfig[orientation].type;

export const getPanelFeedSettings = (orientation: PanelOrientation, { settings }: State) =>
  settings.panelConfig[orientation].feedSettings;

export const getLeftPanelFeedType = ({ settings }: State) => settings.panelConfig.left.type;
export const getLeftPanelFeedSettings = ({ settings }: State) => settings.panelConfig.left.feedSettings;
export const getRightPanelFeedType = ({ settings }: State) => settings.panelConfig.right.type;
export const getRightPanelFeedSettings = ({ settings }: State) => settings.panelConfig.right.feedSettings;
