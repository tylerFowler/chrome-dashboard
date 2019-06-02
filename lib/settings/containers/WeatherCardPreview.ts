import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getRelativeFuturePeriod } from '../../weather/selectors';
import WeatherCard, { WeatherCardProps } from '../../weather/components/WeatherCard';

type RequiredProps = Pick<WeatherCardProps, 'location'>;

const mapStateToProps = (_: GlobalState, ownProps: RequiredProps): Partial<WeatherCardProps> => ({
    ...ownProps,
    futurePeriod: getRelativeFuturePeriod(),

    // test data
    currentWeatherType: 'clearDay',
    currentTemperature: 80,
    futureWeatherType: 'clearNight',
    futureTemperature: 65,
});

export default connect(mapStateToProps)(WeatherCard);
