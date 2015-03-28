var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {id: "mystuff"}, 
        React.createElement(Clock, null), 
        React.createElement(DNList, {showTop: true, maxStories: 5})
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
