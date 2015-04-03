var React = require('react');

// TODO: this component should have 2 props:
// - cityName : Colloquial name for the city (i.e. 'KC')
// - city : Address of the city (i.e. Kansas City, MO, 64111 USA)

WeatherCard = React.createClass({
  getInitialState: function() {
    return {
      err: null,
      city: undefined,

      currentWeather: {
        temp: undefined,
        condition: undefined
      },

      futureWeather: {
        timeOfDay: undefined,
        temp: undefined,
        condition: undefined
      }
    };
  },

  fillMockupData: function() {
    this.setState({
      err: null,
      city: 'KC',

      currentWeather: {
        temp: 72,
        condition: 'Sunny'
      },

      futureWeather: {
        timeOfDay: 'Tonight',
        temp: 64,
        condition: 'Stormy'
      }
    });
  },

  componentDidMount: function() {
    this.fillMockupData();
  },

  render: function() {
    return (
      <div className="weather-card">
        <div className="city">
          <span>{this.state.city}</span>
        </div>
      </div>
    );
  }
});

module.exports = WeatherCard;
