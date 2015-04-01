var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');
var HNList = require('./components/hn');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("div", {className: "left-pane"}, 
          React.createElement(DNList, {showTop: false, maxStories: 5})
        ), 

        React.createElement("div", {className: "center-pane"}, 
          React.createElement(Clock, null)
        ), 

        React.createElement("div", {className: "right-pane"}, 
          React.createElement(HNList, {showTop: false, maxStories: 5})
        )
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
