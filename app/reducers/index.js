import { combineReducers } from 'redux';
import newsFeed from './newsFeed';
import clock from './clock';

export function createFeedReducer(feedName) {
  return (state, action) => {
    return action.feed === feedName ? newsFeed(state, action) : state || {};
  };
}

export default combineReducers({
  hnFeed: createFeedReducer('HN'),
  dnFeed: createFeedReducer('DN'),
  clock
});
