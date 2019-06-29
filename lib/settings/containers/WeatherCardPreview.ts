import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getRelativeFuturePeriod } from '../../weather/selectors';
import WeatherCardPreview, { WeatherCardPreviewProps } from '../components/weather/WeatherCardPreview';
import { getWeatherUnits } from '../selectors';

type RequiredProps = Pick<WeatherCardPreviewProps, 'location'>;

const mapStateToProps = (state: GlobalState, ownProps: RequiredProps): Partial<WeatherCardPreviewProps> => ({
  location: ownProps.location,
  unit: getWeatherUnits(state),
  futurePeriod: getRelativeFuturePeriod(),
});

export default connect(mapStateToProps)(WeatherCardPreview);
