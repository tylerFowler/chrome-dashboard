import action, { ActionType } from 'typesafe-actions';
import { FeedSettings, PanelSettings } from './reducer';

export enum Actions {
  Commit = 'SETTINGS_COMMIT',
  UpdateFeedConfiguration = 'SETTINGS_UPDATE_FEED_CONFIG',
  UpdatePanelConfiguration = 'SETTINGS_UPDATE_PANEL_CONFIG',
}

export type SettingsAction = ActionType<
  | typeof updateFeedConfig
  | typeof updatePanelConfig
>;

export const commit = () => action.action(Actions.Commit);

export const updateFeedConfig = (config: FeedSettings) =>
  action.action(Actions.UpdateFeedConfiguration, { update: config });

export const updatePanelConfig = (panel: 'left'|'right', config: PanelSettings) =>
  action.action(Actions.UpdatePanelConfiguration, { update: config }, { panel });
