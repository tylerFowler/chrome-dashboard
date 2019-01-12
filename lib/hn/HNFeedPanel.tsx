import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { startAutoRefresh, stopAutoRefresh } from './actions';
import HNFeedPanel, { HNFeedPanelProps } from './components/HNFeedPanel';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNFeedPanelProps>): Partial<HNFeedPanelProps> => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch: Function): Partial<HNFeedPanelProps> => ({
  startHNFeedRefresh() { dispatch(startAutoRefresh()); },
  stopHNFeedRefresh() { dispatch(stopAutoRefresh()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNFeedPanel);
