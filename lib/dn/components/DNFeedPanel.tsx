import React from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { DNPost } from '../reducer';
import dnTheme from '../theme';

export interface DNFeedPanelProps extends FeedProps {
  title: never;
  readonly stories: readonly DNPost[];
  readonly maxStoryCount: number;
}

const DNFeedPanel: React.SFC<DNFeedPanelProps> = ({ stories, ...panelProps }) =>
  <FeedPanel {...panelProps} title="Designer News" theme={dnTheme}>
    {stories.map((post, idx) =>
        <li key={post.id}>
          <FeedItem
            id={post.id}
            index={idx + 1} key={post.id}
            title={post.title}
            url={post.url || post.dnLink}
            upvotes={post.voteCount}
            author={post.author}
            commentCount={post.commentCount}
            commentLink={post.dnLink}
          />
        </li>,
      )}
  </FeedPanel>
;

export default DNFeedPanel;
