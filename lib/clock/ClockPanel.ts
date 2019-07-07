import { connect } from 'react-redux';
import { GlobalState } from '../store';
import Clock, { ClockProps } from './components/Clock';
import { getClockDate } from './selectors';

const mapStateToProps = (state: GlobalState, ownProps: Partial<ClockProps>): Partial<ClockProps> => ({
  ...ownProps,
  date: getClockDate(state),
});

export default connect(mapStateToProps, () => ({}))(Clock);
