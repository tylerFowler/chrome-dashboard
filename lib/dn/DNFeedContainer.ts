import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import DNFeedContainer, { DNFeedContainerProps as Props } from './components/DNFeedContainer';

const mapStateToProps = (_: GlobalState, ownProps: Partial<Props>): Partial<Props> => ({
  ...ownProps,
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

export default connect(mapStateToProps, mapDispatchToProps)(DNFeedContainer);
