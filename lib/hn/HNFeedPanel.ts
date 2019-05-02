import { connect } from 'react-redux';
import HNFeedPanel, { HNFeedPanelProps } from './components/HNFeedPanel';
import { GlobalState } from '../store';
import { isLoadingStories, getFetchError, getStoryPage } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNFeedPanelProps>): Partial<HNFeedPanelProps> => ({
  ...ownProps,
  loading: isLoadingStories(ownProps.feed, state),
  fetchError: getFetchError(ownProps.feed, state),
  stories: getStoryPage(ownProps.feed, ownProps.maxStoryCount, state),
});

export default connect(mapStateToProps)(HNFeedPanel);
