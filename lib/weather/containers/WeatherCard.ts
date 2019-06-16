import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getWeatherLocationConfig } from 'lib/settings/selectors';
import { getCurrentForecast, getRelativeFuturePeriod, getFutureForecast, getForecastFetchError } from '../selectors';
import WeatherCard, { WeatherCardProps } from '../components/WeatherCard';
import { fetchForecast as fetchForecastAction } from '../actions';

const mapStateToProps = (state: GlobalState): Partial<WeatherCardProps> => ({
  location: getWeatherLocationConfig(state).displayName || undefined,
  currentWeatherType: getCurrentForecast(state).condition,
  currentTemperature: getCurrentForecast(state).temperature,
  futurePeriod: getRelativeFuturePeriod(),
  futureWeatherType: getFutureForecast(state).condition,
  futureTemperature: getFutureForecast(state).temperature,
  forecastFetchError: getForecastFetchError(state),
});

const mapDispatchToProps = (dispatch: Function): Pick<WeatherCardProps, 'fetchForecast'> => ({
  fetchForecast(location, unit) { dispatch(fetchForecastAction(location, unit)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherCard);
