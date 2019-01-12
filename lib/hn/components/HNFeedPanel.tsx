import React from 'react';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import hnTheme from '../theme';

export type HNFeedPanelProps = Pick<FeedProps, Exclude<keyof FeedProps, 'title'>>;

export default class HNFeedPanel extends React.Component<HNFeedPanelProps> {
  public render() {
    return (
      <FeedPanel {...this.props} title="Hacker News" theme={hnTheme} />
    );
  }
}
