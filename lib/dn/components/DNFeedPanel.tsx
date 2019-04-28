import React, { useEffect } from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { DNPost } from '../reducer';
import dnTheme from '../theme';

export interface DNFeedPanelProps extends FeedProps {
  title: never;
  readonly stories: ReadonlyArray<DNPost>;
  fetchPosts(): void;
  startFeedRefresh(): void;
  stopFeedRefresh(): void;
}

const DNFeedPanel: React.SFC<DNFeedPanelProps> = props => {
  useEffect(() => {
    props.fetchPosts();
    props.startFeedRefresh();

    return props.stopFeedRefresh;
  }, []);

  return (
    <FeedPanel {...props} title="Designer News" theme={dnTheme}>
      {props.stories.map((post, idx) =>
          <li key={idx}>
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
  );
}

export default DNFeedPanel;
