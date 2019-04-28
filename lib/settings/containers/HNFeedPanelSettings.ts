import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import HNSettings, { HNSettingsProps } from '../components/HNSettings';
import { getPanelFeedSettings, getPanelFeedType } from '../selectors';
import { HNFeedSettings } from '../interface';
import { updatePanelConfig } from '../actions';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HNSettingsProps>): Partial<HNSettingsProps> => {
  if (!getPanelFeedType(ownProps.panelOrientation, state)) {
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
