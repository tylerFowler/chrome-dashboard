var React = require('react');

// Components
var Clock       = require('./components/clock');
var DNList      = require('./components/dn');
var HNList      = require('./components/hn');
var WeatherCard = require('./components/weather_card');
var Bookmark    = require('./components/bookmark');


var App = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="left-pane">
          <DNList showTop={false} maxStories={9} />
        </div>

        <div className="center-pane">
          <Clock />

          <div className="widget-container">
            <div className="left-widget">
              <WeatherCard />
            </div>

            <div className="right-widget sunrise-card">
            </div>
          </div>

          <div className="bookmark-container">

          </div>

        </div>

        <div className="right-pane">
          <HNList showTop={false} maxStories={9} />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
