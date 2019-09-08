import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from 'lib/store';
import { Actions as RefreshActions } from 'lib/autorefresh';
import { FeedSettingsContext } from 'lib/settings/context';
import dnTheme from '../theme';
import { fetchPosts } from '../actions';
import { getStoryPage, isLoadingStories, getFetchError } from '../selectors';
import FeedItem from 'lib/panel/components/FeedItem';
import FeedPanel, { FeedProps } from 'lib/panel/components/FeedPanel';

const DNFeedPanel: React.SFC<Omit<FeedProps, 'title'>> = panelProps => {
  const { pullSize } = useContext(FeedSettingsContext);
  const stories = useSelector((state: GlobalState) => getStoryPage(pullSize, state));
  const loading = useSelector(isLoadingStories);
  const fetchError = useSelector(getFetchError);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts(pullSize));

    const refreshSubscriberName = 'dn';
    dispatch(RefreshActions.subscribe(refreshSubscriberName, fetchPosts(pullSize)));

    return () => {
      dispatch(RefreshActions.unsubscribe(refreshSubscriberName));
    };
  }, [ pullSize ]);

  return (
    <FeedPanel {...panelProps} title="Designer News" theme={dnTheme}
      loading={loading} fetchError={fetchError}
    >
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
  );
};

export default DNFeedPanel;
