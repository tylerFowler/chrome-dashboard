import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from './store';
import { getPanelFeedType } from './settings/selectors';
import { FeedType, PanelOrientation } from './settings/interface';
import { HNFeedSettingsProvider, FeedSettingsProvider } from './settings/context';
import DNFeedPanel from './dn/DNFeedContainer';
import HNFeedPanel from './hn/HNFeedContainer';
import RSSFeedPanel from './rss/components/RSSFeedPanel';

interface DashboardPanelProps {
  readonly feedType: FeedType;
  readonly orientation: PanelOrientation;
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const DashboardPanel: React.SFC<DashboardPanelProps> = ({ feedType, orientation, style, className }) => {
  if (orientation === 'left') {
    return (
      <FeedSettingsProvider>
        <RSSFeedPanel title="New York Times" feedUrl="https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
          panelOrientation={orientation}
        />
      </FeedSettingsProvider>
    );
  }

  switch (feedType) {
  case FeedType.HN:
    return (
      <FeedSettingsProvider>
        <HNFeedSettingsProvider orientation={orientation}>
          <HNFeedPanel panelOrientation={orientation} style={style} className={className} />
        </HNFeedSettingsProvider>
      </FeedSettingsProvider>
    );
  case FeedType.DN:
    return (
      <FeedSettingsProvider>
        <DNFeedPanel panelOrientation={orientation} style={style} className={className} />
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
