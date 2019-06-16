import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getCurrentForecast, getRelativeFuturePeriod, getFutureForecast } from '../selectors';
import WeatherCard, { WeatherCardProps } from '../components/WeatherCard';
import { fetchForecast as fetchForecastAction } from '../actions';

const mapStateToProps = (state: GlobalState): Partial<WeatherCardProps> => ({
  currentWeatherType: getCurrentForecast(state).condition,
  currentTemperature: getCurrentForecast(state).temperature,
  futurePeriod: getRelativeFuturePeriod(),
  futureWeatherType: getFutureForecast(state).condition,
  futureTemperature: getFutureForecast(state).temperature,
});

const mapDispatchToProps = (dispatch: Function): Pick<WeatherCardProps, 'fetchForecast'> => ({
  fetchForecast(location, unit) { dispatch(fetchForecastAction(location, unit)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherCard);
