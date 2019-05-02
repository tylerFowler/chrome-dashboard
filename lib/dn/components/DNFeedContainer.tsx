import React, { useContext, useEffect } from 'react';
import dnTheme from '../theme';
import { FeedProps } from '../../panel/components/FeedPanel';
import { FeedSettingsContext } from '../../settings/context';
import DNFeedPanel from '../DNFeedPanel';

export interface DNFeedContainerProps extends FeedProps {
  title: never;
  fetchPosts(pullSize: number): void;
  startFeedRefresh(refreshIval: number, pullSize: number): void;
  stopFeedRefresh(): void;
}

const DNFeedContainer: React.SFC<DNFeedContainerProps> = ({
  fetchPosts, startFeedRefresh, stopFeedRefresh, ...panelProps
}) => {
  const { refreshInterval, pullSize } = useContext(FeedSettingsContext);

  useEffect(() => {
    fetchPosts(pullSize);
    startFeedRefresh(refreshInterval, pullSize);

    return stopFeedRefresh;
  }, []);

  return <DNFeedPanel {...panelProps} theme={dnTheme} maxStoryCount={pullSize} />;
};

export default DNFeedContainer;
