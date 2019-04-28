import React from 'react';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { HNPost } from '../reducer';
import hnTheme from '../theme';
import { PageType } from '../../hn/interface';

export interface HNFeedPanelProps extends FeedProps {
  title: never;
  readonly stories: ReadonlyArray<HNPost>;
  fetchPosts(feed: PageType): void;
  startHNFeedRefresh(refreshIval: number, feed: PageType): void;
  stopHNFeedRefresh(): void;
}

export default class HNFeedPanel extends React.Component<HNFeedPanelProps> {
  public componentDidMount() {
    // TODO: get both of these from a context, convert this to an FC and use
    // useContext w/ a useEffect to do this
    // NOTE: keep defaults
    this.props.fetchPosts(PageType.NewStories);

    // TODO: this may need to take a type, and every time it's changed we'll need
    // to stop refresh & start it w/ the new type
    this.props.startHNFeedRefresh(5 * 60 * 1000, PageType.NewStories);
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
  }
}
