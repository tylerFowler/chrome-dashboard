import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getLocation, getCurrentForecast, getRelativeFuturePeriod, getFutureForecast } from '../selectors';
import WeatherCard, { WeatherCardProps } from '../components/WeatherCard';
import { fetchForecast as fetchForecastAction } from '../actions';
import { WeatherLocation, WeatherLocationType } from '../interface';

const mapStateToProps = (state: GlobalState): Partial<WeatherCardProps> => ({
  location: getLocation(state).displayName || getLocation(state).value.toString(),
  currentWeatherType: getCurrentForecast(state).condition,
  currentTemperature: getCurrentForecast(state).temperature,
  futurePeriod: getRelativeFuturePeriod(),
  futureWeatherType: getFutureForecast(state).condition,
  futureTemperature: getFutureForecast(state).temperature,
});

const testLoc: WeatherLocation = {
  type: WeatherLocationType.CityName,
  value: 'Kansas City',
  countryCode: 'US',
  displayName: 'KC',
};

const mapDispatchToProps = (dispatch: Function): Pick<WeatherCardProps, 'fetchForecast'> => ({
  // TODO: where does this data come from? Maybe a settings provider?
  fetchForecast() { dispatch(fetchForecastAction(testLoc, 'F')); },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherCard);
