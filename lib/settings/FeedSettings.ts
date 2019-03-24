import { connect } from 'react-redux';
import { GlobalState } from '../store';
import FeedSettings, { FeedSettingsProps } from './components/FeedSettings';
import {
  getFeedRefreshInterval,
  getLeftPanelFeedSettings, getLeftPanelFeedType,
  getRightPanelFeedSettings, getRightPanelFeedType,
} from './selectors';

const mapStateToProps = (state: GlobalState): Partial<FeedSettingsProps> => ({
  feedRefreshIval: getFeedRefreshInterval(state),
  leftPanelType: getLeftPanelFeedType(state),
  leftPanelSettings: getLeftPanelFeedSettings(state),
  rightPanelType: getRightPanelFeedType(state),
  rightPanelSettings: getRightPanelFeedSettings(state),
});

const mapDispatchToProps = (dispatch: Function): Partial<FeedSettingsProps> => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FeedSettings);
