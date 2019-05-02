import React from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { HNPost } from '../reducer';
import { FeedType } from '../interface';
import FeedSelector from './FeedSelector';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly feed: FeedType;
  readonly stories: readonly HNPost[];
  setFeed(feed: FeedType): void;
}

const HNFeedPanel: React.SFC<HNFeedPanelProps> = ({ stories, feed, setFeed, ...panelProps }) =>
  <FeedPanel {...panelProps} title="Hacker News"
    renderFeedControls={() => <FeedSelector feed={feed} onChange={setFeed} />}
  >
    {stories.map((post, idx) =>
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
;

export default HNFeedPanel;
