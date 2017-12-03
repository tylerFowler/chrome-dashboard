const initialState = {
  longitude: 39.103243,
  latitude: -94.582919,
  cityDisplayName: 'KC',
  condition: 'sunny',
  temp: 74,
  tempType: 'Fahrenheit',
  upcomingWeather: {
    descriptor: 'Tomorrow',
    condition: 'cloudy',
    temp: 53
  }
};

export default function weather(state = initialState, action) {
  const { type } = action;

  switch (type) {
  default:
    return state;
  }
}
