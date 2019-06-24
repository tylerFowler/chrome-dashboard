import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getWeatherLocationConfig } from 'lib/settings/selectors';
import { getCurrentForecast, getRelativeFuturePeriod, getFutureForecast, getForecastFetchError } from '../selectors';
import WeatherCard, { WeatherCardProps } from '../components/WeatherCard';
import { fetchForecast as fetchForecastAction } from '../actions';
import { refreshWeatherCoords } from '../../settings/actions';

const mapStateToProps = (state: GlobalState): Partial<WeatherCardProps> => ({
  location: getWeatherLocationConfig(state).displayName || undefined,
  currentWeatherType: getCurrentForecast(state).condition,
  currentTemperature: getCurrentForecast(state).temperature,
  futurePeriod: getRelativeFuturePeriod(),
  futureWeatherType: getFutureForecast(state).condition,
  futureTemperature: getFutureForecast(state).temperature,
  forecastFetchError: getForecastFetchError(state),
});

const mapDispatchToProps = (dispatch: Function): Pick<WeatherCardProps, 'fetchForecast'|'refineLocation'> => ({
  fetchForecast(location, unit) { dispatch(fetchForecastAction(location, unit)); },
  refineLocation() { dispatch(refreshWeatherCoords()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherCard);
