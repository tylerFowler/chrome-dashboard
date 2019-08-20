import React from 'react';
import FeedItem from 'lib/panel/components/FeedItem';
import FeedSelector from 'lib/panel/components/FeedSelector';
import FeedPanel, { FeedProps } from 'lib/panel/components/FeedPanel';
import { HNPost } from '../reducer';
import { FeedType } from '../interface';
import FeedOptionGroup from './FeedOptionGroup';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly feed: FeedType;
  readonly stories: readonly HNPost[];
  readonly maxStoryCount: number;
  setFeed(feed: FeedType): void;
}

const HNFeedPanel: React.SFC<HNFeedPanelProps> = ({ stories, feed, setFeed, ...panelProps }) =>
  <FeedPanel {...panelProps} title="Hacker News"
    renderFeedControls={orientation =>
      <FeedSelector orientation={orientation} feed={feed} onChange={setFeed}>
        <FeedOptionGroup />
      </FeedSelector>
    }
  >
    {stories.map((post, idx) =>
      <li key={post.id}>
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
