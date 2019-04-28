import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import DNFeedPanel, { DNFeedPanelProps } from './components/DNFeedPanel';
import { getFetchError, getStoryPage, isLoadingStories } from './selectors';

// TODO: pull these out into a container component so we can pass settings into the data
const mapStateToProps = (state: GlobalState, ownProps: Partial<DNFeedPanelProps>): Partial<DNFeedPanelProps> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  fetchError: getFetchError(state),
  stories: getStoryPage(15, state),
});

const mapDispatchToProps = (dispatch: Function): Partial<DNFeedPanelProps> => ({
  fetchPosts() { dispatch(fetchPosts()); },
  startFeedRefresh(refreshIval) { dispatch(startAutoRefresh(refreshIval)); },
  stopFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(DNFeedPanel);
