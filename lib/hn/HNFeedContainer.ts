import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedContainer, { HNFeedContainerProps as Props } from './components/HNFeedContainer';

const mapStateToProps = (_: GlobalState, ownProps: Partial<Props>): Partial<Props> => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch: Function, ownProps: Pick<Props, 'panelOrientation'>): Partial<Props> => ({
  fetchPosts(feed, pullSize) { dispatch(fetchPosts(feed, pullSize)); },
  startHNFeedRefresh(refreshIval, feed, pullSize) {
    const refreshId = `hn_${ownProps.panelOrientation}`;

    dispatch(startAutoRefresh(refreshId, refreshIval, feed, pullSize));
  },
  stopHNFeedRefresh() {
    const refreshId = `hn_${ownProps.panelOrientation}`;

    dispatch(stopAutoRefresh(refreshId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedContainer);
