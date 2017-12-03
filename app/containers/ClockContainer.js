import { connect } from 'react-redux';
import { tick } from '../actions/clock';
import Clock from '../components/Clock';

const mapStateToProps = ({ clock }) => ({
  useTwelveHourClock: clock.useTwelveHourClock,
  time: clock.time,
  date: clock.date
});

const mapDispatchToProps = dispatch => ({
  ticker() { return dispatch(tick(new Date())); }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clock);
