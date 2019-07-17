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

// TODO: remove this in favor of using Redux hooks
const HNFeedContainer: React.SFC<HNFeedContainerProps> = ({
  fetchPosts, startHNFeedRefresh, stopHNFeedRefresh, ...panelProps
}) => {
  const { refreshInterval, pullSize } = useContext(FeedSettingsContext);
  const { defaultFeedType } = useContext(HNSettingsContext);

  const [ currentFeed, setFeed ] = useState(defaultFeedType);

  useEffect(() => {
    fetchPosts(currentFeed, pullSize);
    startHNFeedRefresh(refreshInterval, currentFeed, pullSize);

    return stopHNFeedRefresh;
  }, [ currentFeed ]);

  return <HNFeedPanel {...panelProps} theme={hnTheme} maxStoryCount={pullSize}
    feed={currentFeed} setFeed={setFeed}
  />;
};

export default HNFeedContainer;
