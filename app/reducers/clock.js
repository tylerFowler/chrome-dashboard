import actionTypes from '../constants/clockConstants';

const initialState = {
  useTwelveHourClock: true,
  time: {
    hour: 0,
    minute: 0,
    period: 'PM'
  },
  date: {
    month: 'August',
    day: 23,
    year: 2017
  }
};

export default function clock(state = initialState, action) {
  switch (action.type) {
  case actionTypes.TICK:
    return Object.assign({}, state, { time: action.time, date: action.date });
  default:
    return state;
  }
}
