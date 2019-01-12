import React from 'react';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import hnTheme from '../theme';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  startHNFeedRefresh(): void;
  stopHNFeedRefresh(): void;
}

export default class HNFeedPanel extends React.Component<HNFeedPanelProps> {
  public render() {
    return (
      <FeedPanel {...this.props} title="Hacker News" theme={hnTheme} />
    );
  }
}
