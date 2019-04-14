import action, { ActionType } from 'typesafe-actions';
import { FeedSettings, PanelSettings, State as SettingsState } from './reducer';
import { FeedType } from './interface';

export enum Actions {
  Commit = 'SETTINGS_COMMIT',
  Committed = 'SETTINGS_COMITTED',
  CommitFailure = 'SETTINGS_COMMIT_FAILURE',
  ReceiveSettings = 'SETTINGS_RECV',
  UpdateFeedConfiguration = 'SETTINGS_UPDATE_FEED_CONFIG',
  UpdatePanelConfiguration = 'SETTINGS_UPDATE_PANEL_CONFIG',
}

export type SettingsAction = ActionType<
  | typeof updateFeedConfig
  | typeof updatePanelConfig
  | typeof receiveSettings
>;

export const commit = () => action.action(Actions.Commit);
export const committed = () => action.action(Actions.Committed);
export const commitFailure = (error: Error) =>
  action.action(Actions.CommitFailure, { error });

export const receiveSettings = (settings: SettingsState) =>
  action.action(Actions.ReceiveSettings, settings);

export const updateFeedConfig = (config: Partial<FeedSettings>) =>
  action.action(Actions.UpdateFeedConfiguration, { update: config });

export const updatePanelConfig = (panel: 'left'|'right', config: Partial<PanelSettings>) =>
  action.action(Actions.UpdatePanelConfiguration, { update: config }, { panel });

export const updateFeedRefreshInterval = (ivalMinutes: number) =>
  updateFeedConfig({ refreshInterval: ivalMinutes });

export const setPanelFeedType = (panel: 'left'|'right', type: FeedType) =>
  updatePanelConfig(panel, { type });
