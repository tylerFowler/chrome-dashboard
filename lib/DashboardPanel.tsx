import React from 'react';
import { connect } from 'react-redux';
import { FeedType, PanelOrientation } from './settings/interface';
import DNFeedPanel from './dn/DNFeedPanel';
import HNFeedPanel from './hn/HNFeedContainer';
import HNFeedSettingsProvider from './hn/HNFeedSettingsProvider';
import { GlobalState } from './store';
import { getPanelFeedType } from './settings/selectors';

interface DashboardPanelProps {
  readonly feedType: FeedType;
  readonly orientation: PanelOrientation;
  readonly style: React.CSSProperties;
}

const DashboardPanel: React.SFC<DashboardPanelProps> = ({ feedType, orientation, style }) => {
  switch (feedType) {
  case FeedType.HN:
    return (
      <HNFeedSettingsProvider orientation={orientation}>
        <HNFeedPanel panelOrientation={orientation} style={style} />
      </HNFeedSettingsProvider>
    );
  case FeedType.DN:
    return <DNFeedPanel panelOrientation={orientation} style={style} />;
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
