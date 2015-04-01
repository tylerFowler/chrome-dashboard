var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');
var HNList = require('./components/hn');


var App = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="left-pane">
          <DNList showTop={false} maxStories={5} />
        </div>

        <div className="center-pane">
          <Clock />
        </div>

        <div className="right-pane">
          <HNList showTop={false} maxStories={5} />
        </div>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
