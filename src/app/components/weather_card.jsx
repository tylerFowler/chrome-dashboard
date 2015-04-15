var React      = require('react');
var forecastio = require('../model/forecastio');

// TODO: this component should have 2 props:
// - cityName : Colloquial name for the city (i.e. 'KC')
// - city : Address of the city (i.e. Kansas City, MO, 64111 USA)

WeatherCard = React.createClass({
  getInitialState: function() {
    return {
      err: null,
      city: undefined,

      currentWeather: {
        temp: '00',
        condition: undefined
      },

      futureWeather: {
        timeOfDay: 'Tonight',
        temp: '00',
        condition: undefined
      }
    };
  },

  // Gets the future 'tense' to use based on the current time:
  //   5 am to 6 pm - Tonight
  //   7pm to 4am - Tomorrow
  getFutureTense: function() {
    var curHour = (new Date()).getHours();
    return (curHour >= 5 && curHour <= 18) ? 'Tonight' : 'Tomorrow';
  },

  getFutureTime: function(futureTense) {
    var curTime = new Date();

    if (futureTense === 'Tonight') {
      curTime.setHours(forecastio.tonightHour);
      return curTime;
    } else if (futureTense === 'Tomorrow') {
      // since we want 'tomorrow' to be even technically the same day when it's
      // between midnight and 4 am we need a bit of extra logic
      if (curTime.getHours() >= 19) // are we at or after 7pm?
        curTime.setDate(curTime.getDate() + 1); // get us to tomorrow

      curTime.setHours(forecastio.tomorrowHour);
      return curTime;
    } else this.setState({err: new Error(futureTense + ' is not recognized')});
  },

  updateForecast: function() {
    this.setState({city: forecastio.cityName});

    // update current temp
    forecastio.getForecast(null, function(err, forecast) {
      if (err) return this.setState({err: err});

      this.setState({
        currentWeather: {
          temp: forecast.temp.toFixed(),
          condition: forecast.condition
        }
      });
    }.bind(this));

    // get the future time & get forecast for it
    var futureTense = this.getFutureTense();
    var futureTime = this.getFutureTime(futureTense);

    forecastio.getForecast(futureTime, function(err, forecast) {
      if (err) return this.setState({err: err});

      this.setState({
        futureWeather: {
          timeOfDay: futureTense,
          temp: forecast.temp.toFixed(),
          condition: forecast.condition
        }
      });
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateForecast();

    setInterval(function() {
      this.updateForecast();
    }.bind(this), forecastio.refresh);
  },

  render: function() {
    return (
      <div className="weather-card">

        <div className="city-container">
          <div className="city">
            <span>{this.state.city}</span>
          </div>
        </div>

        <div className="current-container">
          <div className="weather-current">
            <div className={"condition " + this.state.currentWeather.condition}>
            </div>

            <div className="temp">
              {this.state.currentWeather.temp}&deg;
            </div>
          </div>
        </div>

        <div className="future-container">
          <div className="weather-future">
            <span className={"time-of-day " +
              (this.state.futureWeather.timeOfDay === 'Tonight' ? '' : 'wide')}>
                {this.state.futureWeather.timeOfDay}:
            </span>

            <div className="temp">
              {this.state.futureWeather.temp}&deg;
            </div>

            <div className={"condition " + this.state.futureWeather.condition}>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = WeatherCard;
