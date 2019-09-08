import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from 'lib/store';
import { HNSettingsContext, FeedSettingsContext } from 'lib/settings/context';
import hnTheme from '../theme';
import { FeedType } from '../interface';
import { fetchPosts } from '../actions';
import { isLoadingStories, getFetchError, getStoryPage } from '../selectors';
import { Actions as RefreshActions } from 'lib/autorefresh';
import FeedItem from 'lib/panel/components/FeedItem';
import FeedSelector from 'lib/panel/components/FeedSelector';
import FeedPanel, { FeedProps } from 'lib/panel/components/FeedPanel';
import FeedOptionGroup from './FeedOptionGroup';

const HNFeedPanel: React.SFC<Omit<FeedProps, 'title'>> = panelProps => {
  const { pullSize } = useContext(FeedSettingsContext);
  const { defaultFeedType } = useContext(HNSettingsContext);

  const [ currentFeed, setFeed ] = useState(defaultFeedType);

  // ensure that when the default feed type is changed that a forced update is done locally
  useEffect(() => { setFeed(defaultFeedType); }, [ defaultFeedType ]);

  const stories = useSelector((state: GlobalState) => getStoryPage(currentFeed, pullSize, state));
  const loading = useSelector((state: GlobalState) => isLoadingStories(currentFeed, state));
  const fetchError = useSelector((state: GlobalState) => getFetchError(currentFeed, state));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts(currentFeed, pullSize));

    const refreshSubscriptionKey = `hn_${currentFeed}`;
    dispatch(RefreshActions.subscribe(refreshSubscriptionKey, fetchPosts(currentFeed, pullSize)));

    return () => {
      dispatch(RefreshActions.unsubscribe(refreshSubscriptionKey));
    };
  }, [ currentFeed, pullSize ]);

  return (
    <FeedPanel {...panelProps} title="Hacker News" theme={hnTheme}
      loading={loading} fetchError={fetchError}
      renderFeedControls={orientation =>
        <FeedSelector orientation={orientation} feed={currentFeed} onChange={(feed: FeedType) => setFeed(feed)}>
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
  );
};

export default HNFeedPanel;
