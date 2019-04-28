import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { FeedPanelSettings, PanelOrientation } from '../settings/interface';
import { getPanelFeedSettings } from '../settings/selectors';
import { HNSettingsContext } from '../settings/context';

interface SettingsProps {
  readonly settings: FeedPanelSettings;
  readonly orientation: PanelOrientation;
}

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
