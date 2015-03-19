var React = require('react');

// Components
var Clock = require('./components/clock');


var App = React.createClass({
  render: function() {
    return (
      <Clock />
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
