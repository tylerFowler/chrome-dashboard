import { connect } from 'react-redux';
import WeatherCard from '../components/WeatherCard';
import constants from '../constants/weatherConstants';

const mapStateToProps = () => ({
  cityDisplayName: 'KC',
  condition: 'sunny',
  temp: 74,
  tempType: constants.FAHREINHEIT,
  upcomingWeather: {
    descriptor: 'Tomorrow',
    condition: 'cloudy',
    temp: 53
  }
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeatherCard);
