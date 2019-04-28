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

// TODO: once startAutoRefresh takes an ID, we'll want to generate it in this func
// so that the component doesn't have to worry about it. Either using the ownProps
// to build the ID or a rando number/incrementor from a memoized function, because
// multiple calls of this needs to produce the same value for the same component.
const mapDispatchToProps = (dispatch: Function): Partial<HNFeedPanelProps> => ({
  fetchPosts(feed) { dispatch(fetchPosts(feed)); },
  startHNFeedRefresh(refreshIval, feed) { dispatch(startAutoRefresh(refreshIval, feed)); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedPanel);
