import { GlobalState } from '../store';

type State = Pick<GlobalState, 'clock'>;

export const getClockDate = ({ clock }: State) => clock.date;
