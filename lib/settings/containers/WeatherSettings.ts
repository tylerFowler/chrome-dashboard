import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import WeatherSettings, { WeatherSettingsProps } from '../components/weather/Settings';
import { getWeatherLocationConfig, getWeatherUnits } from '../selectors';
import { updateWeatherConfig } from '../actions';

const mapStateToProps = (state: GlobalState): Partial<WeatherSettingsProps> => ({
  weatherUnit: getWeatherUnits(state),
  location: getWeatherLocationConfig(state),
});

const mapDispatchToProps = (dispatch: Function): Partial<WeatherSettingsProps> => ({
  setWeatherUnit(unit) {
    dispatch(updateWeatherConfig({ unit }));
  },
  setLocationConfig(configUpdate) {
    dispatch(updateWeatherConfig({ location: configUpdate }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherSettings);
