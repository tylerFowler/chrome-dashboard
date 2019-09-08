import React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from './store';
import { getPanelFeedType } from './settings/selectors';
import { FeedType, PanelOrientation } from './settings/interface';
import { HNFeedSettingsProvider, FeedSettingsProvider, SubredditFeedSettingsProvider } from './settings/context';
import DNFeedPanel from './dn/components/DNFeedPanel';
import HNFeedPanel from './hn/HNFeedContainer';
import RedditFeedPanel from './reddit/components/RedditFeedPanel';

interface DashboardPanelProps {
  readonly feedType: FeedType;
  readonly orientation: PanelOrientation;
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const DashboardPanel: React.SFC<DashboardPanelProps> = ({ feedType, orientation, style, className }) => {
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
  case FeedType.Reddit:
    return (
      <FeedSettingsProvider>
        <SubredditFeedSettingsProvider orientation={orientation}>
          <RedditFeedPanel panelOrientation={orientation} style={style} className={className} />
        </SubredditFeedSettingsProvider>
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
