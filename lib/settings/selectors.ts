import { GlobalState } from '../store';

type State = Pick<'settings', GlobalState>;

export const getFeedRefreshInterval = ({ settings }: State) => settings.feed.refreshInterval;

export const getLeftPanelFeedType = ({ settings }: State) => settings.feed.panels.left.type;
export const getLeftPanelFeedSettings = ({ settings }: State) => settings.feed.panels.left.feedSettings;
export const getRightPanelFeedType = ({ settings }: State) => settings.feed.panels.right.type;
export const getRightPanelFeedSettings = ({ settings }: State) => settings.feed.panels.right.feedSettings;
