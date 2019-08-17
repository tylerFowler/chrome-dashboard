import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import FeedItem from '../../panel/components/FeedItem';
import { FeedType } from '../interface';
import { fetchSubreddit } from '../actions';
import { getPostsForSub, isFetchingSub, getSubFetchError } from '../selectors';
import { GlobalState } from '../../store';

export interface RedditFeedPanelProps extends FeedProps {
  readonly subreddit: string; // the exact name of the subreddit feed to display
  readonly feedType?: FeedType;
}

const RedditFeedPanel: React.FC<RedditFeedPanelProps> = ({ subreddit, feedType, ...panelProps }) => {
  const maxStoryCount = 10 as const; // TODO: this should come from a RedditSettingsContext
  const curFeedType = feedType; // TODO: this should come from settings, w/ possible override

  // TODO: this should be from settings, falling back to actual sub name, falling back to props title
  const title = panelProps.title;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSubreddit(subreddit, curFeedType, maxStoryCount));
    // TODO: start autorefresh, return stop autorefresh
  }, [ curFeedType ]);

  const posts = useSelector((state: GlobalState) => getPostsForSub(subreddit, feedType, maxStoryCount, state));
  const isFetching = useSelector((state: GlobalState) => isFetchingSub(subreddit, feedType, state));
  const fetchError = useSelector((state: GlobalState) => getSubFetchError(subreddit, feedType, state));

  // TODO: this will eventually need to have a feed selector, possibly reuse from HN state
  return <FeedPanel loading={isFetching} fetchError={fetchError} title={title} {...panelProps}>
    {posts.map((post, idx) =>
      <li key={post.id}>
        <FeedItem
          id={post.id}
          index={idx + 1} key={post.id}
          title={post.title}
          url={post.permalink}
          upvotes={post.upvotes}
          author={post.author}
        />
      </li>,
    )}
  </FeedPanel>;
};

RedditFeedPanel.defaultProps = {
  feedType: FeedType.Rising, // TODO: review this decision
};

export default RedditFeedPanel;
