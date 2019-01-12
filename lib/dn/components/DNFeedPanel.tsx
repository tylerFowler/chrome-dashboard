import React from 'react';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import dnTheme from '../theme';

export type DNFeedPanelProps = Pick<FeedProps, Exclude<keyof FeedProps, 'title'>>;

export default class DNFeedPanel extends React.Component<DNFeedPanelProps> {
  public render() {
    return (
      <FeedPanel {...this.props} title="Designer News" theme={dnTheme} />
    );
  }
}
