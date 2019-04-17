import { connect } from 'react-redux';
import { GlobalState } from '../store';
import { getActiveToast } from './selectors';
import Header, { HeaderProps } from './components/Header';

const mapStateToProps = (state: GlobalState, ownProps: Partial<HeaderProps>): Partial<HeaderProps> => ({
  ...ownProps,
  toast: getActiveToast(state),
});

export default connect(mapStateToProps)(Header);
