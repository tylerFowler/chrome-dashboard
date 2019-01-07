import { connect } from 'react-redux';
import { GlobalState } from '../store';
import Clock, { ClockProps } from './components/Clock';
import { getClockDate } from './selector';

const mapStateToProps = (state: GlobalState): Partial<ClockProps> => ({
  date: getClockDate(state),
});

export default connect(mapStateToProps, () => ({}))(Clock);
