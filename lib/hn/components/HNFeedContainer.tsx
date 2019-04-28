import React, { useEffect, useContext, useState } from 'react';
import hnTheme from '../theme';
import { FeedType } from '../interface';
import { FeedProps } from '../../panel/components/FeedPanel';
import { HNSettingsContext, FeedSettingsContext } from '../../settings/context';
import HNFeedPanel from '../HNFeedPanel';

export interface HNFeedContainerProps extends FeedProps {
  title: never;
  fetchPosts(feed: FeedType): void;
  startHNFeedRefresh(refreshIval: number, feed: FeedType): void;
  stopHNFeedRefresh(): void;
}

const HNFeedContainer: React.SFC<HNFeedContainerProps> = ({
  fetchPosts, startHNFeedRefresh, stopHNFeedRefresh, ...panelProps
}) => {
  const feedSettings = useContext(FeedSettingsContext);
  const hnSettings = useContext(HNSettingsContext);

  useEffect(() => {
    fetchPosts(hnSettings.defaultFeedType); // TODO: add pullSize
    startHNFeedRefresh(feedSettings.refreshInterval, hnSettings.defaultFeedType);

    return stopHNFeedRefresh();
  }, []);

  const [ currentFeed ] = useState(hnSettings.defaultFeedType);

  return <HNFeedPanel {...panelProps} theme={hnTheme} feed={currentFeed} />;
};

export default HNFeedContainer;
