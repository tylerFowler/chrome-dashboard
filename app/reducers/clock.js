const initialState = {
  time: {
    hour: 10,
    minute: 32,
    modifier: 'PM'
  },
  date: {
    month: 'August',
    day: 23,
    year: 2017
  }
};

export default function clock(state = initialState, action) {
  switch (action.type) {
  default:
    return state;
  }
}
