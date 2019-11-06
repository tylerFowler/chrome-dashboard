import { GlobalState } from '../store';
import { PanelOrientation, FeedType, HNFeedSettings, SubredditFeedSettings } from './interface';
import { FeedType as HNFeedType } from 'lib/hn/interface';

type State = Pick<GlobalState, 'settings'>;

export const getSerializableSettings = ({ settings }: State) => {
  const serializableSettings = { ...settings };

  delete serializableSettings.toast;
  delete serializableSettings.storageMeta;

  return serializableSettings;
};

export const getActiveToast = ({ settings }: State) => settings.toast;
export const getStorageError = ({ settings }: State) => settings.storageMeta.storageError;
export const hasStoredSettings = ({ settings }: State) => settings.storageMeta.hasStoredSettings;

export const getFeedSettings = ({ settings }: State) => settings.feed;
export const getFeedRefreshInterval = ({ settings }: State) => settings.feed.refreshInterval;
export const getFeedPullSize = ({ settings }: State) => settings.feed.pullSize;

export const getPanelFeedType = (orientation: PanelOrientation, { settings }: State) =>
  settings.panelConfig[orientation].type;

export const getPanelFeedSettings = (orientation: PanelOrientation, { settings }: State) =>
  settings.panelConfig[orientation].feedSettings;

export const getLeftPanelFeedType = ({ settings }: State) => settings.panelConfig.left.type;
export const getLeftPanelFeedSettings = ({ settings }: State) => settings.panelConfig.left.feedSettings;
export const getRightPanelFeedType = ({ settings }: State) => settings.panelConfig.right.type;
export const getRightPanelFeedSettings = ({ settings }: State) => settings.panelConfig.right.feedSettings;

export const getWeatherUnits = ({ settings }: State) => settings.weather.unit;
export const isRefreshingWeatherLocation = ({ settings }: State) => settings.weather.refreshingLocation;
export const getWeatherLocationRefreshError = ({ settings }: State) => settings.weather.locationRefreshError;
export const getWeatherLocationConfig = ({ settings }: State) => settings.weather.location;

export const getFeedName = (orientation: PanelOrientation, state: State) => {
  switch (getPanelFeedType(orientation, state)) {
  case FeedType.DN:
    return `Designer News - ${orientation}`;
  case FeedType.HN: {
    const feedSettings = getPanelFeedSettings(orientation, state) as HNFeedSettings;
    return `Hacker News - ${HNFeedType.getDisplayString(feedSettings.defaultFeedType)}`;
  }
  case FeedType.Reddit: {
    const feedSettings = getPanelFeedSettings(orientation, state) as SubredditFeedSettings;
    return `Subreddit ${feedSettings.sub} - ${feedSettings.defaultFeedType}`;
  }
  default:
    return FeedType.getDisplayString(getPanelFeedType(orientation, state));
  }
};
