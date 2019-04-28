import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import FeedSettings, { FeedSettingsProps } from '../components/FeedSettings';
import { updateFeedRefreshInterval, updateFeedPullSize, setPanelFeedType } from '../actions';
import {
  getFeedRefreshInterval,
  getFeedPullSize,
  getLeftPanelFeedSettings, getLeftPanelFeedType,
  getRightPanelFeedSettings, getRightPanelFeedType,
} from '../selectors';

const mapStateToProps = (state: GlobalState): Partial<FeedSettingsProps> => ({
  feedRefreshIval: getFeedRefreshInterval(state),
  feedPullSize: getFeedPullSize(state),
  leftPanelType: getLeftPanelFeedType(state),
  leftPanelSettings: getLeftPanelFeedSettings(state),
  rightPanelType: getRightPanelFeedType(state),
  rightPanelSettings: getRightPanelFeedSettings(state),
});

const mapDispatchToProps = (dispatch: Function): Partial<FeedSettingsProps> => ({
  updateFeedRefreshIval(ivalMinutes) { dispatch(updateFeedRefreshInterval(ivalMinutes)); },
  updateFeedPullSize(pullSize) { dispatch(updateFeedPullSize(pullSize)); },
  // TODO: do something with the settings, when we have some
  updateLeftPanel(type, _) { dispatch(setPanelFeedType('left', type)); },
  updateRightPanel(type, _) { dispatch(setPanelFeedType('right', type)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedSettings);
