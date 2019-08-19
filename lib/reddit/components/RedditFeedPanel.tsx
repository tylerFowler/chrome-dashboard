import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalState } from '../../store';
import { SubredditSettingsContext, FeedSettingsContext } from '../../settings/context';
import { defaultTheme } from '../../panel/panelTheme';
import { FeedType } from '../interface';
import { fetchSubreddit } from '../actions';
import { getPostsForSub, isFetchingSub, getSubFetchError } from '../selectors';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import FeedItem from '../../panel/components/FeedItem';

export interface RedditFeedPanelProps extends Omit<FeedProps, 'title'> {
  readonly title?: string;
  readonly subreddit?: string; // the exact name of the subreddit feed to display
  readonly feedType?: FeedType;
}

const RedditFeedPanel: React.FC<RedditFeedPanelProps> = ({ subreddit, feedType, ...panelProps }) => {
  const { pullSize: maxStoryCount } = useContext(FeedSettingsContext);
  const { sub = subreddit, defaultFeedType, theme = {} } = useContext(SubredditSettingsContext);

  const curFeedType = feedType || defaultFeedType; // TODO: should probably be local state once we can change it

  // TODO: this should be from settings, falling back to actual sub name, falling back to props title
  const title = panelProps.title || sub;

  const dispatch = useDispatch();
  useEffect(() => {
    if (sub) {
      dispatch(fetchSubreddit(sub, curFeedType, maxStoryCount));
    }
    // TODO: start autorefresh, return stop autorefresh
  }, [ curFeedType ]);

  const posts = useSelector((state: GlobalState) => getPostsForSub(sub, feedType, maxStoryCount, state));
  const isFetching = useSelector((state: GlobalState) => isFetchingSub(sub, feedType, state));

  // TODO: need to check for 'Too Many Requests errors & display a message appropriately, likely in the API file
  const fetchError = useSelector((state: GlobalState) => getSubFetchError(sub, feedType, state));

  // TODO: this will eventually need to have a feed selector, possibly reuse from HN state
  return <FeedPanel loading={isFetching} fetchError={fetchError} title={title}
    theme={{ ...defaultTheme, ...theme }} {...panelProps}
  >
    {posts.map((post, idx) =>
      <li key={post.id}>
        <FeedItem
          id={post.id}
          index={idx + 1} key={post.id}
          title={post.title}
          url={post.permalink}
          author={post.author}
          upvotes={post.upvotes}
          commentCount={post.commentCount}
          commentLink={post.permalink}
        />
      </li>,
    )}
  </FeedPanel>;
};

RedditFeedPanel.defaultProps = {
  feedType: FeedType.Rising, // TODO: review this decision
};

export default RedditFeedPanel;
