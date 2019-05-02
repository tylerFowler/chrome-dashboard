import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from './store';
import { getPanelFeedType } from './settings/selectors';
import { FeedType, PanelOrientation } from './settings/interface';
import { HNFeedSettingsProvider, FeedSettingsProvider } from './settings/context';
import DNFeedPanel from './dn/DNFeedContainer';
import HNFeedPanel from './hn/HNFeedContainer';

interface DashboardPanelProps {
  readonly feedType: FeedType;
  readonly orientation: PanelOrientation;
  readonly style: React.CSSProperties;
}

const DashboardPanel: React.SFC<DashboardPanelProps> = ({ feedType, orientation, style }) => {
  switch (feedType) {
  case FeedType.HN:
    return (
      <FeedSettingsProvider>
        <HNFeedSettingsProvider orientation={orientation}>
          <HNFeedPanel panelOrientation={orientation} style={style} />
        </HNFeedSettingsProvider>
      </FeedSettingsProvider>
    );
  case FeedType.DN:
    return (
      <FeedSettingsProvider>
        <DNFeedPanel panelOrientation={orientation} style={style} />
      </FeedSettingsProvider>
    );
  default:
    return null; // TODO: create a custom 'error panel' component?
  }
};

export default connect(
  (state: GlobalState, { orientation, ...ownProps }: Partial<DashboardPanelProps>): Partial<DashboardPanelProps> => ({
    ...ownProps,
    feedType: getPanelFeedType(orientation, state),
  }),
)(DashboardPanel);
