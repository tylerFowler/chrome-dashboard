(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("div", {className: "left-pane"}, 
          React.createElement(DNList, {showTop: true, maxStories: 5})
        ), 

        React.createElement("div", {className: "center-pane"}, 
          React.createElement(Clock, null)
        ), 

        React.createElement("div", {className: "right-pane"}, 
          React.createElement("span", null, "HN")
        )
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
    } else if (curDate.getHours() === 0) {
      timeObj.hours = 12;
      timeObj.period = 'AM';
    } else {
      timeObj.hours = curDate.getHours();
      timeObj.period = 'AM';
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

DNList = React.createClass({displayName: "DNList",
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

  // renderError: function(err) {
  //   return (
  //
  //   )
  // },

  render: function() {
    var dnlist = this.state.stories.map(function(story, index) {
      return (
        React.createElement(DNItem, {storyId: index, 
          title: story.title, 
          url: story.url, 
          dnurl: story.dnurl, 
          upvotes: story.upvotes, 
          author: story.author, 
          commentCount: story.commentCount}
        )
      );
    });

    console.dir(dnlist);

    return (
      React.createElement("div", {className: "dn-container"}, 
        React.createElement("div", {className: "component-header dn-header"}, 
          React.createElement("span", null, "Designer News")
        ), 

        React.createElement("div", {className: "dnlist"}, 
          dnlist
        )
      )
    );
  }
});

var DNItem = React.createClass({displayName: "DNItem",
  render: function() {
    var itemId = 'dnitem-' + this.props.storyId;

    // maybe do the index as a ::before element
    return (
      React.createElement("div", {className: "article-item dn-item", id: itemId}, 

        React.createElement("div", {className: "article-index"}, 
          React.createElement("span", null, this.props.storyId + 1)
        ), 

        React.createElement("div", {className: "article-title"}, 
          React.createElement("a", {href: this.props.url, target: "_blank"}, this.props.title)
        ), 

        React.createElement("div", {className: "article-metadata"}, 
          React.createElement("span", {className: "article-upvote"}, this.props.upvotes), 
          React.createElement("div", {className: "upvote-icon"}), 

          React.createElement("span", {className: "article-author"}, this.props.author), 
          React.createElement("div", {className: "article-data-divider"}), 

          React.createElement("a", {className: "article-comments", href: this.props.dnurl, target: "_blank"}, 
            this.props.commentCount, " comments"
          )

        )
      )
    );
  }
});

module.exports = DNList;

},{"../model/dn_store":4,"react":"react"}],4:[function(require,module,exports){
(function(){var $,t,e,r;$=require("jquery"),r=require("underscore"),e=JSON.parse(localStorage.getItem("settings")).dn,t=function(){function t(t,e,r,n){this.clientId=t,this.clientSecret=e,this.redirectUri=r,this.refreshInterval=n,this.dnUri="https://api-news.layervault.com/api/v1"}return t.prototype.getTopStories=function(t,e){return $.getJSON(""+this.dnUri+"/stories?client_id="+this.clientId,{}).done(function(r){return function(n){return r.processStories(n.stories.slice(0,t),t,function(t){return e(null,t)})}}(this)).fail(function(t,r,n){return e(n)})},t.prototype.getRecentStories=function(t,e){return $.getJSON(""+this.dnUri+"/stories/recent?client_id="+this.clientId,{}).done(function(r){return function(n){return r.processStories(n.stories.slice(0,t),t,function(t){return e(null,t)})}}(this)).fail(function(t,r,n){return e(n)})},t.prototype.processStories=function(t,e,n){var i;return i=[],r.each(t,function(t,r){var o;return o={title:t.title,url:t.url,dnurl:t.site_url,upvotes:t.vote_count,author:t.user_display_name,commentCount:t.comments.length},i.push(o),r===e-1?n(i):void 0})},t}(),module.exports=new t(e.client_id,e.client_secret,e.redirect_uri,e.refresh_interval_ms)}).call(this);
},{"jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
(function(){var $,e,t,r;$=require("jquery"),r=require("underscore"),t=JSON.parse(localstorage.getItem("settings")).hn,e=function(){function e(e){this.refresh_interval=e,this.hnUri="https://hacker-news.firebaseio.com/v0/"}return e.prototype.getTopStories=function(e,t){return $.getJSON(""+this.hnUri+"/topstories",{}).done(function(r){return function(n){var i;return i=n.slice(0,e),r.getStories(i,function(e,r){return e?t(e):0===r.length?t(new Error("Received zero stories")):t(null,r)})}}(this)).fail(function(e,r,n){return t(n)})},e.prototype.getRecentStories=function(e,t){return $.getJSON(""+this.hnUri+"/newstories",{}).done(function(r){return function(n){var i;return i=n.slice(0,e),r.getStories(i,function(e,r){return e?t(e):0===r.length?t(new Error("Received zero stories")):t(null,r)})}}(this)).fail(function(e,r,n){return t(n)})},e.prototype.getStories=function(e,t){var n;return n=[],r.each(e,function(r,i){return $.getJSON(""+this.hnUri+"/item/"+r,{}).done(function(r){var o;return o={title:r.title,url:r.url,score:r.score,author:r.by,commentCount:r.kids.length},n.push(o),i===e.length-1?t(n):void 0}).fail(function(e,r,n){return t(n)})})},e}(),module.exports=new e(t.refresh_interval_ms)}).call(this);
},{"jquery":"jquery","underscore":"underscore"}]},{},[1,2,3,4,5]);
