(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {id: "mystuff"}, 
        React.createElement(Clock, null), 
        React.createElement(DNList, {showTop: true, maxStories: 10})
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);

},{"./components/clock":2,"./components/dn":3,"react":"react"}],2:[function(require,module,exports){
var React = require('react');

var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December' ];

var Clock = React.createClass({displayName: "Clock",
  getInitialState: function() {
    return { time: {} };
  },

  updateTimeData: function() {
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
    timeObj.day = curDate.getDate();
    timeObj.year = curDate.getFullYear();

    this.setState({ time: timeObj });
  },

  componentDidMount: function() {
    this.updateTimeData();
    setInterval(this.updateTimeData, 1000); // update every second
  },

  render: function() {
    return (
      React.createElement("div", {className: "clock"}, 
        React.createElement("div", {className: "time"}, 
          React.createElement("span", {id: "cur-time"}, this.state.time.hours, ":", this.state.time.minutes, " ", this.state.time.period)
        ), 
        React.createElement("div", {className: "divider"}), 
        React.createElement("div", {className: "date"}, 
          React.createElement("span", {id: "cur-date"}, this.state.time.month, " ", this.state.time.day, ", ", this.state.time.year)
        )
      )
    );
  }
});

module.exports = Clock;

},{"react":"react"}],3:[function(require,module,exports){
var React = require('react');
var dn    = require('../model/dn_store');

// TODO: need a couple components here:
// - DNList : the overall list of items, simple wrapper w/ div structure
// - DNItem : each individual article, decorates the stories

var DNList = React.createClass({displayName: "DNList",
  getInitialState: function() {
    return { stories: [], err: null }
  },

  dnCb: function(err, stories) {
    if (err) this.setState({ stories: [], err: err });
    else if (stories.length === 0) {
      this.setState({
        stories: [],
        err: new Error("We didn't get any stories!")
      });
    } else this.setState({ stories: stories, err: null });
  },

  loadDnStories: function(limit) {
    console.log("Limit is " + limit);

    if (this.props.showTop === true)
      dn.getTopStories(limit, this.dnCb);
    else
      dn.getRecentStories(limit, this.dnCb);
  },

  componentDidMount: function() {
    this.loadDnStories(this.props.maxStories);

    setInterval((function() {
      this.loadDnStories(this.props.maxStories)
    }).bind(this), dn.refreshInterval);
  },

  render: function() {
    return (
      React.createElement("span", null, "Stories Count: ", this.state.stories.length)
    );
  }
});

module.exports = DNList;

},{"../model/dn_store":4,"react":"react"}],4:[function(require,module,exports){
(function(){var $,t,e,r;$=require("jquery"),r=require("underscore"),e=JSON.parse(localStorage.getItem("settings")).dn,t=function(){function t(t,e,r,n){this.clientId=t,this.clientSecret=e,this.redirectUri=r,this.refreshInterval=n,this.dnUri="https://api-news.layervault.com/api/v1"}return t.prototype.getTopStories=function(t,e){return $.getJSON(""+this.dnUri+"/stories?client_id="+this.clientId,{}).done(function(r){return function(n){return r.processStories(n.stories.slice(0,t),t,function(t){return e(null,t)})}}(this)).fail(function(t,r,n){return e(n)})},t.prototype.getRecentStories=function(t,e){return $.getJSON(""+this.dnUri+"/stories/recent?client_id="+this.clientId,{}).done(function(r){return function(n){return r.processStories(n.stories.slice(0,t),t,function(t){return e(null,t)})}}(this)).fail(function(t,r,n){return e(n)})},t.prototype.processStories=function(t,e,n){var i;return i=[],r.each(t,function(t,r){var o;return o={title:t.title,url:t.url,upvotes:t.vote_count,author:t.user_display_name,comment_count:t.comments.length},i.push(o),r===e-1?n(i):void 0})},t}(),module.exports=new t(e.client_id,e.client_secret,e.redirect_uri,e.refresh_interval_ms)}).call(this);
},{"jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
(function(){}).call(this);
},{}]},{},[1,2,3,4,5]);
