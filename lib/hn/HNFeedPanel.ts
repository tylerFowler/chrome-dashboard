import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedPanel, { HNFeedPanelProps } from './components/HNFeedPanel';
import { getStoryPage, isLoadingStories } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNFeedPanelProps>): Partial<HNFeedPanelProps> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  stories: getStoryPage(15, state),
});

const mapDispatchToProps = (dispatch: Function): Partial<HNFeedPanelProps> => ({
  fetchPosts() { dispatch(fetchPosts()); },
  // TODO get interval time from settings
  startHNFeedRefresh() { dispatch(startAutoRefresh(5 * 60 * 1000)); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedPanel);
