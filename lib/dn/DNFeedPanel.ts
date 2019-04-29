import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import DNFeedPanel, { DNFeedPanelProps as Props } from './components/DNFeedPanel';
import { getFetchError, getStoryPage, isLoadingStories } from './selectors';

// TODO: pull these out into a container component so we can pass settings into the data
const mapStateToProps = (state: GlobalState, ownProps: Partial<Props>): Partial<Props> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  fetchError: getFetchError(state),
  stories: getStoryPage(15, state),
});

const mapDispatchToProps = (dispatch: Function, ownProps: Pick<Props, 'panelOrientation'>): Partial<Props> => ({
  fetchPosts(pullSize) { dispatch(fetchPosts(pullSize)); },
  startFeedRefresh(refreshIval, pullSize) {
    const refreshId = `dn_${ownProps.panelOrientation}`;

    dispatch(startAutoRefresh(refreshId, refreshIval, pullSize));
  },
  stopFeedRefresh() {
    const refreshId = `dn_${ownProps.panelOrientation}`;

    dispatch(stopAutoRefresh(refreshId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DNFeedPanel);
