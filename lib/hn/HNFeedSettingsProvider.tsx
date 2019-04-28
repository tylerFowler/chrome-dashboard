import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { FeedPanelSettings, HNFeedSettings, PanelOrientation } from '../settings/interface';
import { PageType } from './interface';
import { getPanelFeedSettings } from '../settings/selectors';

interface SettingsProps {
  readonly settings: FeedPanelSettings;
  readonly orientation: PanelOrientation;
}

const defaultHNSettings: HNFeedSettings = {
  defaultFeedType: PageType.NewStories,
};

export const HNSettingsContext = React.createContext(defaultHNSettings);

const BaseComponent: React.SFC<SettingsProps> = ({ settings, children }) =>
  <HNSettingsContext.Provider value={settings}>
    {children}
  </HNSettingsContext.Provider>
;

export default connect(
  (state: GlobalState, ownProps: Pick<SettingsProps, 'orientation'>): Partial<SettingsProps> => ({
    settings: getPanelFeedSettings(ownProps.orientation, state),
  }),
)(BaseComponent);
