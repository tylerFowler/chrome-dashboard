import React, { useEffect, useContext, useState } from 'react';
import hnTheme from '../theme';
import { FeedType } from '../interface';
import { FeedProps } from '../../panel/components/FeedPanel';
import { HNSettingsContext, FeedSettingsContext } from '../../settings/context';
import HNFeedPanel from '../HNFeedPanel';

export interface HNFeedContainerProps extends FeedProps {
  title: never;
  fetchPosts(feed: FeedType, pullSize: number): void;
  startHNFeedRefresh(refreshIval: number, feed: FeedType, pullSize: number): void;
  stopHNFeedRefresh(): void;
}

const HNFeedContainer: React.SFC<HNFeedContainerProps> = ({
  fetchPosts, startHNFeedRefresh, stopHNFeedRefresh, ...panelProps
}) => {
  const { refreshInterval, pullSize } = useContext(FeedSettingsContext);
  const hnSettings = useContext(HNSettingsContext);

  useEffect(() => {
    fetchPosts(hnSettings.defaultFeedType, pullSize);
    startHNFeedRefresh(refreshInterval, hnSettings.defaultFeedType, pullSize);

    return stopHNFeedRefresh();
  }, []);

  const [ currentFeed ] = useState(hnSettings.defaultFeedType);

  return <HNFeedPanel {...panelProps} theme={hnTheme} feed={currentFeed} />;
};

export default HNFeedContainer;
