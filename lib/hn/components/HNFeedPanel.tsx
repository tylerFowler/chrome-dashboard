import React from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { HNPost } from '../reducer';
import { PageType } from '../interface';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly feed: PageType;
  readonly stories: readonly HNPost[];
}

const HNFeedPanel: React.SFC<HNFeedPanelProps> = ({ stories, ...panelProps }) =>
  <FeedPanel {...panelProps} title="Hacker News">
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
