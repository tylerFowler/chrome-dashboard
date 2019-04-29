import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { fetchPosts, startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedContainer, { HNFeedContainerProps as Props } from './components/HNFeedContainer';

const mapStateToProps = (_: GlobalState, ownProps: Partial<Props>): Partial<Props> => ({
  ...ownProps,
});

// TODO: once startAutoRefresh takes an ID, we'll want to generate it in this func
// so that the component doesn't have to worry about it. Either using the ownProps
// to build the ID or a rando number/incrementor from a memoized function, because
// multiple calls of this needs to produce the same value for the same component.
const mapDispatchToProps = (dispatch: Function): Partial<Props> => ({
  fetchPosts(feed, pullSize) { dispatch(fetchPosts(feed, pullSize)); },
  startHNFeedRefresh(refreshIval, feed, pullSize) { dispatch(startAutoRefresh(refreshIval, feed, pullSize)); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedContainer);
