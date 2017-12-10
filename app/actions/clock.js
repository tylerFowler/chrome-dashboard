import actionTypes from '../constants/clockConstants';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
];

export function tick(d) {
  return {
    type: actionTypes.TICK,
    time: {
      hour: d.getHours(),
      minute: d.getMinutes(),
      period: d.getHours() >= 12 ? 'PM' : 'AM'
    },
    date: {
      month: monthNames[d.getMonth()],
      day: d.getDate(),
      year: d.getFullYear()
    }
  };
}
