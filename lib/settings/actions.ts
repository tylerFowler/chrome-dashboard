import { action, ActionType } from 'typesafe-actions';
import { FeedSettings, State as SettingsState } from './reducer';
import { FeedType, FeedPanelSettings, PanelOrientation } from './interface';

export enum Actions {
  Commit = 'SETTINGS_COMMIT',
  Committed = 'SETTINGS_COMITTED',
  CommitFailure = 'SETTINGS_COMMIT_FAILURE',
  AddToast = 'SETTINGS_ADD_TOAST',
  RemoveToast = 'SETTINGS_REMOVE_TOAST',
  ReceiveSettings = 'SETTINGS_RECV',
  UpdateFeedConfiguration = 'SETTINGS_UPDATE_FEED_CONFIG',
  UpdatePanelConfiguration = 'SETTINGS_UPDATE_PANEL_CONFIG',
  UpdatePanelType = 'SETTINGS_UPDATE_PANEL_TYPE',

  RefreshFeeds = 'FEEDS_REFRESH',
}

export type SettingsAction = ActionType<
  | typeof addToast
  | typeof removeToast
  | typeof updateFeedConfig
  | typeof updatePanelConfig
  | typeof setPanelFeedType
  | typeof receiveSettings
>;

export const commit = () => action(Actions.Commit);
export const committed = () => action(Actions.Committed);
export const commitFailure = (error: Error) =>
  action(Actions.CommitFailure, { error });

export const addToast = (content: string) => action(Actions.AddToast, { content });
export const removeToast = () => action(Actions.RemoveToast);

// refreshFeeds should be used when a setting is updated that should cause the
// refreshing of all feeds
export const refreshFeeds = () => action(Actions.RefreshFeeds);

export const receiveSettings = (settings: SettingsState) =>
  action(Actions.ReceiveSettings, settings);

export const updateFeedConfig = (config: Partial<FeedSettings>) =>
  action(Actions.UpdateFeedConfiguration, { update: config });

export const setPanelFeedType = (panel: PanelOrientation, type: FeedType) =>
  action(Actions.UpdatePanelType, type, { panel });

export const updatePanelConfig = (panel: PanelOrientation, config: Partial<FeedPanelSettings>) =>
  action(Actions.UpdatePanelConfiguration, { update: config }, { panel });

export const updateFeedPullSize = (pullSize: number) => updateFeedConfig({ pullSize });
export const updateFeedRefreshInterval = (ivalMinutes: number) =>
  updateFeedConfig({ refreshInterval: ivalMinutes });
