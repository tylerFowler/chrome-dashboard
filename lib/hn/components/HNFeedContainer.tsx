import React, { useEffect, useContext } from 'react';
import { FeedProps } from '../../panel/components/FeedPanel';
import hnTheme from '../theme';
import { PageType } from '../interface';
import { HNSettingsContext } from '../HNFeedSettingsProvider';
import HNFeedPanel from '../HNFeedPanel';

export interface HNFeedContainerProps extends FeedProps {
  title: never;
  fetchPosts(feed: PageType): void;
  startHNFeedRefresh(refreshIval: number, feed: PageType): void;
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

  return <HNFeedPanel {...panelProps} theme={hnTheme} />;
};

export default HNFeedContainer;
