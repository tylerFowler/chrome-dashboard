import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getPanelFeedSettings, getPanelFeedType } from '../selectors';
import { FeedType } from '../../settings/interface';
import { HNFeedSettings } from '../interface';
import { updatePanelConfig } from '../actions';
import HNSettings, { HNSettingsProps } from '../components/feeds/HNSettings';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNSettingsProps>): Partial<HNSettingsProps> => {
  if (getPanelFeedType(ownProps.panelOrientation, state) !== FeedType.HN) {
    return {};
  }

  const panelState = getPanelFeedSettings(ownProps.panelOrientation, state) as HNFeedSettings;

  return {
    defaultFeedType: panelState.defaultFeedType,
  };
};

const mapDispatchToProps = (dispatch: Function, ownProps: Partial<HNSettingsProps>): Partial<HNSettingsProps> => ({
  setDefaultFeedType(feed) {
    dispatch(updatePanelConfig(ownProps.panelOrientation, {
      defaultFeedType: feed,
    }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HNSettings);
