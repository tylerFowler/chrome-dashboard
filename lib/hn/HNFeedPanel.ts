import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedPanel, { HNFeedPanelProps } from './components/HNFeedPanel';

const mapStateToProps = (_: GlobalState, ownProps: Partial<HNFeedPanelProps>): Partial<HNFeedPanelProps> => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch: Function): Partial<HNFeedPanelProps> => ({
  // TODO get interval time from settings
  startHNFeedRefresh() { dispatch(startAutoRefresh(5 * 60 * 1000)); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedPanel);
