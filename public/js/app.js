(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./components/clock":2,"react":"react"}],2:[function(require,module,exports){
var React = require('react');

var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December' ];

var Clock = React.createClass({displayName: "Clock",
  getInitialState: function() {
    return { time: {} };
  },

  updateTimeData: function() {
    console.log('Updating time...');
    var curDate = new Date();
    var timeObj = {};

    // hours are in military time
    if (curDate.getHours() > 12) {
      timeObj.hours = curDate.getHours() - 12;
      timeObj.period = 'PM';
    } else {
      timeObj.hours = curDate.getHours();
      timeObj.peroid = 'AM';
    }


    timeObj.minutes = curDate.getMinutes();
    timeObj.month = monthNames[curDate.getMonth()];
    timeObj.day = curDate.getDay();
    timeObj.year = curDate.getFullYear();

    this.setState({ time: timeObj });
  },

  componentDidMount: function() {
    console.log('Clock component mounted');
    this.updateTimeData();
    setInterval(this.updateTimeData, 1000); // update every second
  },

  render: function() {
    return (
      React.createElement("div", {classname: "clock"}, 
        React.createElement("div", {classname: "time"}, 
          React.createElement("span", {id: "cur-time"}, this.state.time.hours, ":", this.state.time.minutes, " ", this.state.time.period)
        ), 
        React.createElement("div", {classname: "divider"}), 
        React.createElement("div", {classname: "date"}, 
          React.createElement("span", {id: "cur-date"}, this.state.time.month, " ", this.state.time.day, ", ", this.state.time.year)
        )
      )
    );
  }
});

module.exports = Clock;

},{"react":"react"}]},{},[1,2]);
