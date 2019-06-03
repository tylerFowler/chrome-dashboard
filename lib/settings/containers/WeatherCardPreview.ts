import { connect } from 'react-redux';
import { GlobalState } from '../../store';
import { getRelativeFuturePeriod } from '../../weather/selectors';
import WeatherCardPreview, { WeatherCardPreviewProps } from '../components/weather/WeatherCardPreview';
import { getWeatherAPIKey } from '../selectors';

type RequiredProps = Pick<WeatherCardPreviewProps, 'location'>;

const mapStateToProps = (state: GlobalState, ownProps: RequiredProps): Partial<WeatherCardPreviewProps> => ({
  location: ownProps.location,
  apiKey: getWeatherAPIKey(state),
  futurePeriod: getRelativeFuturePeriod(),
});

export default connect(mapStateToProps)(WeatherCardPreview);
