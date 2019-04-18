import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import FeedSettings, { FeedSettingsProps } from '../components/FeedSettings';
import { updateFeedRefreshInterval, setPanelFeedType } from '../actions';
import {
  getFeedRefreshInterval,
  getLeftPanelFeedSettings, getLeftPanelFeedType,
  getRightPanelFeedSettings, getRightPanelFeedType,
} from '../selectors';

const mapStateToProps = (state: GlobalState): Partial<FeedSettingsProps> => ({
  feedRefreshIval: getFeedRefreshInterval(state),
  leftPanelType: getLeftPanelFeedType(state),
  leftPanelSettings: getLeftPanelFeedSettings(state),
  rightPanelType: getRightPanelFeedType(state),
  rightPanelSettings: getRightPanelFeedSettings(state),
});

const mapDispatchToProps = (dispatch: Function): Partial<FeedSettingsProps> => ({
  updateFeedRefreshIval(ivalMinutes) {
    dispatch(updateFeedRefreshInterval(ivalMinutes));
  },
  // TODO: do something with the settings, when we have some
  updateLeftPanel(type, _) { dispatch(setPanelFeedType('left', type)); },
  updateRightPanel(type, _) { dispatch(setPanelFeedType('right', type)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedSettings);
