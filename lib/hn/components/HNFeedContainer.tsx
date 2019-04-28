import React, { useEffect, useContext, useState } from 'react';
import hnTheme from '../theme';
import { FeedType } from '../interface';
import { FeedProps } from '../../panel/components/FeedPanel';
import { HNSettingsContext } from '../../settings/context';
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
  const hnSettings = useContext(HNSettingsContext);

  useEffect(() => {
    fetchPosts(hnSettings.defaultFeedType);
    startHNFeedRefresh(5 * 60 * 1000, hnSettings.defaultFeedType);

    return stopHNFeedRefresh();
  }, []);

  const [ currentFeed ] = useState(hnSettings.defaultFeedType);

  return <HNFeedPanel {...panelProps} theme={hnTheme} feed={currentFeed} />;
};

export default HNFeedContainer;
