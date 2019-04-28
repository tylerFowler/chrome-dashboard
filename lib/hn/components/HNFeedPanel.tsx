import React, { useEffect, useContext } from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { HNPost } from '../reducer';
import hnTheme from '../theme';
import { PageType } from '../../hn/interface';
import { HNSettingsContext } from '../HNFeedSettingsProvider';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly stories: ReadonlyArray<HNPost>;
  fetchPosts(feed: PageType): void;
  startHNFeedRefresh(refreshIval: number, feed: PageType): void;
  stopHNFeedRefresh(): void;
}

const HNFeedPanel: React.SFC<HNFeedPanelProps> = props => {
  const hnSettings = useContext(HNSettingsContext);

  useEffect(() => {
    props.fetchPosts(hnSettings.defaultFeedType);
    props.startHNFeedRefresh(5 * 60 * 1000, hnSettings.defaultFeedType);

    return props.stopHNFeedRefresh();
  }, []);

  return (
    <FeedPanel {...props} title="Hacker News" theme={hnTheme}>
      {props.stories.map((post, idx) =>
        <li key={idx}>
          <FeedItem
            id={post.id}
            index={idx + 1} key={post.id}
            title={post.title}
            url={post.url || post.hnLink}
            upvotes={post.score}
            author={post.author}
            commentCount={post.commentCount}
            commentLink={post.hnLink}
          />
        </li>,
      )}
    </FeedPanel>
  );
};

export default HNFeedPanel;
