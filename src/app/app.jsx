var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');


var App = React.createClass({
  render: function() {
    return (
      <div id="mystuff">
        <Clock />
        <DNList showTop={true} maxStories={5} />
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
