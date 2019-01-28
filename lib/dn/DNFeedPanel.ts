import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import DNFeedPanel, { DNFeedPanelProps } from './components/DNFeedPanel';
import { getFetchError, getStoryPage, isLoadingStories } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<DNFeedPanelProps>): Partial<DNFeedPanelProps> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  fetchError: getFetchError(state),
  stories: getStoryPage(15, state),
});

const mapDispatchToProps = (dispatch: Function): Partial<DNFeedPanelProps> => ({
  fetchPosts() { dispatch(fetchPosts()); },
  startFeedRefresh() { dispatch(startAutoRefresh(5 * 60 * 1000)); },
  stopFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(DNFeedPanel);
