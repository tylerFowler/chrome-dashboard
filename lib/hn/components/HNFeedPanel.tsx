import React from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { HNPost } from '../reducer';
import hnTheme from '../theme';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly stories: ReadonlyArray<HNPost>;
  fetchPosts(): void;
  startHNFeedRefresh(): void;
  stopHNFeedRefresh(): void;
}

export default class HNFeedPanel extends React.Component<HNFeedPanelProps> {
  public componentDidMount() {
    this.props.fetchPosts();
    this.props.startHNFeedRefresh();
  }

  public componentWillUnmount() {
    this.props.stopHNFeedRefresh();
  }

  public render() {
    return (
      <FeedPanel {...this.props} title="Hacker News" theme={hnTheme}>
        {this.props.stories.map((post, idx) =>
          <li key={idx}>
            <FeedItem
              id={post.id}
              index={idx + 1} key={idx}
              title={post.title}
              url={post.url}
              upvotes={post.score}
              author={post.author}
              commentCount={post.commentCount}
              commentLink={post.hnLink}
            />
          </li>,
        )}
      </FeedPanel>
    );
  }
}
