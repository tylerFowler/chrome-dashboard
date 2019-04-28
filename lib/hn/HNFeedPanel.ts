import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedPanel, { HNFeedPanelProps } from './components/HNFeedPanel';
import { getFetchError, getStoryPage, isLoadingStories } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNFeedPanelProps>): Partial<HNFeedPanelProps> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  fetchError: getFetchError(state),
  stories: getStoryPage(15, state), // TODO: add 'feed item count' setting, populate here
});

// TODO: try and use the shorthand
const mapDispatchToProps = (dispatch: Function): Partial<HNFeedPanelProps> => ({
  fetchPosts(feed) { dispatch(fetchPosts(feed)); },
  startHNFeedRefresh(refreshIval, feed) { dispatch(startAutoRefresh(refreshIval, feed)); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedPanel);
