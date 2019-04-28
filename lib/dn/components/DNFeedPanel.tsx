import React from 'react';
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

export default class DNFeedPanel extends React.Component<DNFeedPanelProps> {
  public componentDidMount() {
    this.props.fetchPosts();
    this.props.startFeedRefresh();
  }

  public componentWillUnmount() {
    this.props.stopFeedRefresh();
  }

  public render() {
    return (
      <FeedPanel {...this.props} title="Designer News" theme={dnTheme}>
        {this.props.stories.map((post, idx) =>
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
}
