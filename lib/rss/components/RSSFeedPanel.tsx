import React, { useEffect } from 'react';
import { GlobalState } from '../../store';
import { isFetchingFeed, getFeedRefreshError, getItemsForFeed, getTitleForFeed } from '../selectors';
import { RSSItem } from '../interface';
import FeedItem from '../../panel/components/FeedItem';
import FeedPanel, { FeedProps } from '../../panel/components/FeedPanel';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRSSFeed } from '../actions';

export interface RSSFeedPanelProps extends Omit<FeedProps, 'title'> {
  readonly title?: string;
  readonly feedUrl: string;
  readonly maxItems?: number;
}

const RSSFeedPanel: React.FC<RSSFeedPanelProps> = ({ feedUrl, maxItems = 10, title, ...panelProps }) => {
  const rssFeedName = title;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRSSFeed(feedUrl, maxItems));
  }, [ feedUrl, maxItems, dispatch ]);

  const isFetching = useSelector<GlobalState, boolean>(state => isFetchingFeed(feedUrl, state));
  const fetchError = useSelector<GlobalState, Error>(state => getFeedRefreshError(feedUrl, state));
  const feedItems = useSelector<GlobalState, readonly RSSItem[]>(state => getItemsForFeed(feedUrl, state));
  const feedTitle = useSelector<GlobalState, string>(state => getTitleForFeed(feedUrl, state));

  return (
    <FeedPanel {...panelProps} title={rssFeedName || feedTitle} loading={isFetching} fetchError={fetchError}>
      {feedItems.map((item, idx) =>
        <li key={item.guid}>
          <FeedItem
            id={item.guid}
            index={idx + 1}
            title={item.title}
            url={item.link}
            author={item.author}
          />
        </li>,
      )}
    </FeedPanel>
  );
};

export default RSSFeedPanel;
