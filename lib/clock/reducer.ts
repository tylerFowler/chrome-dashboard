import { Actions, ClockAction } from './actions';

export interface State {
  readonly date: Date;
}

export const defaultState = {
  date: new Date(),
};

export default function clockReducer(state = defaultState, action: ClockAction) {
  switch (action.type) {
  case Actions.Tick:
    return { ...state, date: new Date() };
  default:
    return state;
  }
}
