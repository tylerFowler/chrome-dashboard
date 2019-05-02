import { connect } from 'react-redux';
import { GlobalState } from '../store';
import DNFeedPanel, { DNFeedPanelProps as Props } from './components/DNFeedPanel';
import { getFetchError, getStoryPage, isLoadingStories } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<Props>): Partial<Props> => ({
  ...ownProps,
  loading: isLoadingStories(state),
  fetchError: getFetchError(state),
  stories: getStoryPage(ownProps.maxStoryCount, state),
});

export default connect(mapStateToProps)(DNFeedPanel);
