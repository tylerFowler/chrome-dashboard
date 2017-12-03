import { connect } from 'react-redux';
import Clock from '../components/Clock';

const mapStateToProps = state => ({
  time: state.clock.time,
  date: state.clock.date
});

export default connect(mapStateToProps)(Clock);
