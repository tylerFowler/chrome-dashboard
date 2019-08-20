import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalState } from 'lib/store';
import { SubredditSettingsContext, FeedSettingsContext } from 'lib/settings/context';
import FeedItem from 'lib/panel/components/FeedItem';
import FeedSelector from 'lib/panel/components/FeedSelector';
import FeedPanel, { FeedProps } from 'lib/panel/components/FeedPanel';
import defaultTheme from '../theme';
import { FeedType } from '../interface';
import { fetchSubreddit } from '../actions';
import FeedOptionGroup from './FeedOptionGroup';
import { getPostsForSub, isFetchingSub, getSubFetchError } from '../selectors';

export interface RedditFeedPanelProps extends Omit<FeedProps, 'title'> {
  readonly title?: string;
  readonly subreddit?: string; // the exact name of the subreddit feed to display
  readonly feedType?: FeedType;
}

const RedditFeedPanel: React.FC<RedditFeedPanelProps> = ({ subreddit, feedType, ...panelProps }) => {
  const dispatch = useDispatch();

  const { pullSize: maxStoryCount } = useContext(FeedSettingsContext);
  const { sub = subreddit, defaultFeedType, theme } = useContext(SubredditSettingsContext);
  const [ activeFeed, setActiveFeed ] = useState(feedType || defaultFeedType);

  useEffect(() => {
    if (sub) {
      dispatch(fetchSubreddit(sub, activeFeed, maxStoryCount));
    }

    // TODO: start autorefresh, return stop autorefresh
  }, [ sub, activeFeed, maxStoryCount ]);

  const posts = useSelector((state: GlobalState) => getPostsForSub(sub, activeFeed, maxStoryCount, state));
  const isFetching = useSelector((state: GlobalState) => isFetchingSub(sub, activeFeed, state));
  const fetchError = useSelector((state: GlobalState) => getSubFetchError(sub, feedType, state));

  return <FeedPanel title={sub} {...panelProps} loading={isFetching} fetchError={fetchError}
    theme={{ ...defaultTheme, ...theme }} renderFeedControls={orientation =>
      <FeedSelector orientation={orientation} feed={activeFeed} onChange={ft => setActiveFeed(ft as FeedType)}>
        <FeedOptionGroup />
      </FeedSelector>
    }
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

export default RedditFeedPanel;
