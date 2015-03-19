var React = require('react');

// Components
var Clock = require('./components/clock');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement(Clock, null)
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
