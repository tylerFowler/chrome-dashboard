(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock         = require('./components/clock');
var DNList        = require('./components/dn');
var HNList        = require('./components/hn');
var WeatherCard   = require('./components/weather_card');
var BookmarkList  = require('./components/bookmark');


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("div", {className: "left-pane"}, 
          React.createElement(DNList, {showTop: false, maxStories: 9})
        ), 

        React.createElement("div", {className: "center-pane"}, 
          React.createElement(Clock, null), 

          React.createElement("div", {className: "widget-container"}, 
            React.createElement("div", {className: "left-widget"}, 
              React.createElement(WeatherCard, null)
            )
          ), 

          React.createElement(BookmarkList, null)

        ), 

        React.createElement("div", {className: "right-pane"}, 
          React.createElement(HNList, {showTop: false, maxStories: 9})
        )
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);

},{"./components/bookmark":2,"./components/clock":4,"./components/dn":5,"./components/hn":6,"./components/weather_card":7,"react":"react"}],2:[function(require,module,exports){
var React = require('react');
var $     = require('jquery');

var BookmarkList = React.createClass({displayName: "BookmarkList",
  // this class doesn't actually do anything, it's just a wrapper to simplify
  // the main view markup
  render: function() {
    return (
      React.createElement("div", {className: "bookmark-container"}, 
        /* Note that the bookmarks are laid out by id number */ 

        React.createElement(Bookmark, {bookmarkId: "bookmark-1", customClass: "bookmark-flipboard", 
          link: "https://flipboard.com/"}), 

        React.createElement(Bookmark, {bookmarkId: "bookmark-2", customClass: "bookmark-simple", 
          link: "https://bank.simple.com/"}), 

        React.createElement(Bookmark, {bookmarkId: "bookmark-3", customClass: "bookmark-newyorker", 
          link: "http://www.newyorker.com/"}), 

        React.createElement(Bookmark, {bookmarkId: "bookmark-4", customClass: "bookmark-qz", 
          link: "http://qz.com/"})
      )
    );
  }
});

var Bookmark = React.createClass({displayName: "Bookmark",
  render: function() {
    return (
      React.createElement("a", {href: this.props.link, target: "_blank", id: this.props.bookmarkId, 
        className: "bookmark-card " + this.props.customClass}, 

        React.createElement("div", {className: "bookmark-logo"})
      )
    );
  }
});

module.exports = BookmarkList;

},{"jquery":"jquery","react":"react"}],3:[function(require,module,exports){
var React = require('react');

CalendarCard = React.createClass({displayName: "CalendarCard",
  getInitialState: function() {
    return {
      err: null,

      calendarList: [],
    };
  },

  fillMockupData: function() {
    this.setState({
      calendarList: [
        {
          name: 'Personal',
          upcomingEvents: [
            {
              title: 'Lunch',
              time: '12:30',
              date: '4-8-2015 00:00:00-0500GMT' // this should be a date object
            }
          ]
        }
      ]
    });
  },

  render: function() {
    return ( React.createElement("p", null, "Not finished!") );
  }
});

modules.export = CalendarCard;

},{"react":"react"}],4:[function(require,module,exports){
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
    if (curDate.getHours() === 12) {
      timeObj.hours = 12;
      timeObj.period = 'PM';
    } else if (curDate.getHours() > 12) {
      timeObj.hours = curDate.getHours() - 12;
      timeObj.period = 'PM';
    } else if (curDate.getHours() === 0) {
      timeObj.hours = 12;
      timeObj.period = 'AM';
    } else {
      timeObj.hours = curDate.getHours();
      timeObj.period = 'AM';
    }


    // we always want the time to be 2 digis (i.e. 09 instead of 9)
    mins = curDate.getMinutes();
    timeObj.minutes = mins > 9 ? '' + mins : '0' + mins;

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
          React.createElement("h1", {id: "cur-time"}, this.state.time.hours, ":", this.state.time.minutes), 
          React.createElement("span", {id: "cur-period"}, this.state.time.period)
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

},{"react":"react"}],5:[function(require,module,exports){
var React = require('react');
var dn    = require('../model/dn_store');

DNList = React.createClass({displayName: "DNList",
  getInitialState: function() {
    return { stories: [], err: null };
  },

  dnCb: function(err, stories) {
    if (err) this.setState({ stories: [], err: err });
    else this.setState({ stories: stories, err: null });
  },

  loadDnStories: function(limit) {
    if (this.props.showTop === true)
      dn.getTopStories(limit, this.dnCb);
    else
      dn.getRecentStories(limit, this.dnCb);
  },

  componentDidMount: function() {
    this.loadDnStories(this.props.maxStories);

    setInterval(function() {
      this.loadDnStories(this.props.maxStories);
    }.bind(this), dn.refreshInterval);
  },

  renderLoading: function() {
    return (
      React.createElement("div", {className: "feed-loading-anim dn-loading"}
      )
    );
  },

  handleError: function(err) {
    return (
      React.createElement("div", {className: "feed-error dn-error"}, 
        React.createElement("div", {className: "feed-error-icon"}), 
        React.createElement("p", {className: "error-msg"}, err.toString())
      )
    );
  },

  render: function() {
    var error;
    if (this.state.err)
      error = this.handleError(this.state.err);
    else
      error = undefined;

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

    var loading;
    if (!error && dnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = '';

    return (
      React.createElement("div", {className: "pane dn-container"}, 
        React.createElement("div", {className: "pane-header dn-header"}, 
          React.createElement("h2", null, "Designer News")
        ), 

        React.createElement("div", {className: "story-list dnlist"}, 
          error, 
          loading, 
          dnlist
        )
      )
    );
  }
});

var DNItem = React.createClass({displayName: "DNItem",
  render: function() {
    var itemId = 'dnitem-' + this.props.storyId;
    var commentText = this.props.commentCount === 1 ? 'comment' : 'comments';

    // TODO: make it say 1 comment instead of 1 comments
    return (
      React.createElement("div", {className: "story-item dn-item", id: itemId}, 

        React.createElement("div", {className: "story-index"}, 
          React.createElement("span", null, this.props.storyId + 1)
        ), 

        React.createElement("div", {className: "story-title"}, 
          React.createElement("a", {href: this.props.url, target: "_blank"}, this.props.title)
        ), 

        React.createElement("div", {className: "story-metadata"}, 
          React.createElement("span", {className: "story-upvotes"}, this.props.upvotes, " upvotes"), 
          React.createElement("div", {className: "upvote-icon"}), 

          React.createElement("span", {className: "story-author"}, this.props.author), 
          React.createElement("div", {className: "story-data-divider"}), 

          React.createElement("a", {className: "story-comments", href: this.props.dnurl, target: "_blank"}, 
            this.props.commentCount, " ", commentText
          )

        )
      )
    );
  }
});

module.exports = DNList;

},{"../model/dn_store":8,"react":"react"}],6:[function(require,module,exports){
var React = require('react');
var hn    = require('../model/hn_store');

HNList = React.createClass({displayName: "HNList",
  getInitialState: function() {
    return { stories: [], err: null };
  },

  hnCb: function(err, stories) {
    if (err) this.setState({ stories: [], err: err });
    else this.setState({ stories: stories, err: null });
  },

  loadHnStories: function(limit) {
    if (this.props.showTop === true)
      hn.getTopStories(limit, this.hnCb);
    else
      hn.getRecentStories(limit, this.hnCb);
  },

  componentDidMount: function() {
    this.loadHnStories(this.props.maxStories);

    setInterval((function() {
      this.loadHnStories(this.props.maxStories);
    }).bind(this), hn.refreshInterval);
  },

  renderLoading: function() {
    return (
      React.createElement("div", {className: "feed-loading-anim hn-loading"}
      )
    );
  },

  handleError: function(err) {
    return (
      React.createElement("div", {className: "feed-error hn-error"}, 
        React.createElement("div", {className: "feed-error-icon"}), 
        React.createElement("p", {className: "error-msg"}, err.toString())
      )
    );
  },

  render: function() {
    var error;
    if (this.state.err)
      error = this.handleError(this.state.err);
    else
      error = undefined;

    var hnlist = this.state.stories.map(function(story, index) {
      return (
        React.createElement(HNItem, {storyId: index, 
          title: story.title, 
          url: story.url, 
          hnurl: story.hnurl, 
          score: story.score, 
          author: story.author, 
          commentCount: story.commentCount}
        )
      );
    });

    var loading;
    if (!error && hnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = undefined;

    return (
      React.createElement("div", {className: "pane hn-container"}, 
        React.createElement("div", {className: "pane-header hn-header"}, 
          React.createElement("h2", null, "Hacker News")
        ), 

        React.createElement("div", {className: "story-list hnlist"}, 
          error, 
          loading, 
          hnlist
        )
      )
    );
  }
});

var HNItem = React.createClass({displayName: "HNItem",
  render: function() {
    var itemId = 'hnitem-' + this.props.storyId;
    var commentText = this.props.commentCount === 1 ? 'comment' : 'comments';

    return (
      React.createElement("div", {className: "story-item hn-item", id: itemId}, 

        React.createElement("div", {className: "story-index"}, 
          React.createElement("span", null, this.props.storyId + 1)
        ), 

        React.createElement("div", {className: "story-title"}, 
          React.createElement("a", {href: this.props.url, target: "_blank"}, this.props.title)
        ), 

        React.createElement("div", {className: "story-metadata"}, 
          React.createElement("span", {className: "story-upvotes"}, this.props.score, " upvotes"), 
          React.createElement("div", {className: "upvote-icon"}), 

          React.createElement("span", {className: "story-author"}, this.props.author), 
          React.createElement("div", {className: "story-data-divider"}), 

          React.createElement("a", {className: "story-comments", href: this.props.hnurl, target: "_blank"}, 
            this.props.commentCount, " ", commentText
          )

        )
      )
    );
  }
});

module.exports = HNList;

},{"../model/hn_store":10,"react":"react"}],7:[function(require,module,exports){
var React      = require('react');
var forecastio = require('../model/forecastio');

// TODO: this component should have 2 props:
// - cityName : Colloquial name for the city (i.e. 'KC')
// - city : Address of the city (i.e. Kansas City, MO, 64111 USA)

WeatherCard = React.createClass({displayName: "WeatherCard",
  getInitialState: function() {
    return {
      err: null,
      city: undefined,

      currentWeather: {
        temp: '00',
        condition: undefined
      },

      futureWeather: {
        timeOfDay: 'Tonight',
        temp: '00',
        condition: undefined
      }
    };
  },

  // Gets the future 'tense' to use based on the current time:
  //   5 am to 6 pm - Tonight
  //   7pm to 4am - Tomorrow
  getFutureTense: function() {
    var curHour = (new Date()).getHours();
    return (curHour >= 5 && curHour <= 18) ? 'Tonight' : 'Tomorrow';
  },

  getFutureTime: function(futureTense) {
    var curTime = new Date();

    if (futureTense === 'Tonight') {
      curTime.setHours(forecastio.tonightHour);
      return curTime;
    } else if (futureTense === 'Tomorrow') {
      // since we want 'tomorrow' to be even technically the same day when it's
      // between midnight and 4 am we need a bit of extra logic
      if (curTime.getHours() >= 19) // are we at or after 7pm?
        curTime.setDate(curTime.getDate() + 1); // get us to tomorrow

      curTime.setHours(forecastio.tomorrowHour);
      return curTime;
    } else this.setState({err: new Error(futureTense + ' is not recognized')});
  },

  updateForecast: function() {
    this.setState({city: forecastio.cityName});

    // update current temp
    forecastio.getForecast(null, function(err, forecast) {
      if (err) return this.setState({err: err});

      this.setState({
        currentWeather: {
          temp: forecast.temp.toFixed(),
          condition: forecast.condition
        }
      });
    }.bind(this));

    // get the future time & get forecast for it
    var futureTense = this.getFutureTense();
    var futureTime = this.getFutureTime(futureTense);

    forecastio.getForecast(futureTime, function(err, forecast) {
      if (err) return this.setState({err: err});

      this.setState({
        futureWeather: {
          timeOfDay: futureTense,
          temp: forecast.temp.toFixed(),
          condition: forecast.condition
        }
      });
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateForecast();

    setInterval(function() {
      this.updateForecast();
    }.bind(this), forecastio.refresh);
  },

  render: function() {
    return (
      React.createElement("div", {className: "weather-card"}, 

        React.createElement("div", {className: "city-container"}, 
          React.createElement("div", {className: "city"}, 
            React.createElement("span", null, this.state.city)
          )
        ), 

        React.createElement("div", {className: "current-container"}, 
          React.createElement("div", {className: "weather-current"}, 
            React.createElement("div", {className: "condition " + this.state.currentWeather.condition}
            ), 

            React.createElement("div", {className: "temp"}, 
              this.state.currentWeather.temp, "°"
            )
          )
        ), 

        React.createElement("div", {className: "future-container"}, 
          React.createElement("div", {className: "weather-future"}, 
            React.createElement("span", {className: "time-of-day " +
              (this.state.futureWeather.timeOfDay === 'Tonight' ? '' : 'wide')}, 
                this.state.futureWeather.timeOfDay, ":"
            ), 

            React.createElement("div", {className: "temp"}, 
              this.state.futureWeather.temp, "°"
            ), 

            React.createElement("div", {className: "condition " + this.state.futureWeather.condition}
            )
          )
        )
      )
    );
  }
});

module.exports = WeatherCard;

},{"../model/forecastio":9,"react":"react"}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var $, DesignerNews, dnSettings, _;

  $ = require('jquery');

  _ = require('underscore');

  dnSettings = JSON.parse(localStorage.getItem('settings')).dn;

  DesignerNews = (function() {
    function DesignerNews(clientId, clientSecret, redirectUri, refreshInterval) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.redirectUri = redirectUri;
      this.refreshInterval = refreshInterval;
      this.dnUri = 'https://api-news.layervault.com/api/v1';
    }


    /*
      * DesignerNews#getTopStories
      * @desc : retrieves the top stories from designer news
      * @param : limit - max number of stories to grab
      * @param : retryCount [Default: 0]
      * @calls : cb(err, [{ title, url, upvotes, author, comment_count }])
     */

    DesignerNews.prototype.getTopStories = function(limit, cb, retryCount) {
      if (retryCount == null) {
        retryCount = 0;
      }
      return $.ajax({
        dataType: 'json',
        url: "" + this.dnUri + "/stories?client_id=" + this.clientId,
        timeout: 3000,
        success: (function(_this) {
          return function(data) {
            return _this.processStories(data.stories.slice(0, limit), function(stories) {
              if (stories.length === 0) {
                return cb(new Error('Received zero stories'));
              }
              return cb(null, stories);
            });
          };
        })(this),
        error: (function(_this) {
          return function(xhr, msg, err) {
            var errMsg;
            errMsg = 'Could not reach DN.\nAre you offline?';
            if (msg !== 'timeout') {
              return cb(new Error(errMsg));
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error(errMsg));
            } else {
              console.log("Retry count is " + retryCount + " - try again");
              return _this.getTopStories(limit, cb, retryCount + 1);
            }
          };
        })(this)
      });
    };


    /*
      * DesignerNews#getRecentStories
      * @desc : retrieves the latest stream of stories from designer news
      * @param : limit - max number of stories to grab
      * @param : retryCount [Default: 0]
      * @calls : cb(err, [{ title, url, dnurl, upvotes, author, commentCount }])
     */

    DesignerNews.prototype.getRecentStories = function(limit, cb, retryCount) {
      if (retryCount == null) {
        retryCount = 0;
      }
      return $.ajax({
        dataType: 'json',
        url: "" + this.dnUri + "/stories/recent?client_id=" + this.clientId,
        timeout: 3000,
        success: (function(_this) {
          return function(data) {
            return _this.processStories(data.stories.slice(0, limit), function(stories) {
              if (stories.length === 0) {
                return cb(new Error('Received zero stories'));
              }
              return cb(null, stories);
            });
          };
        })(this),
        error: (function(_this) {
          return function(xhr, msg, err) {
            var errMsg;
            errMsg = 'Could not reach DN.\nAre you offline?';
            if (msg !== 'timeout') {
              return cb(new Error(errMsg));
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error(errMsg));
            } else {
              console.log("Retry count is " + retryCount + " - try again");
              return _this.getRecentStories(limit, cb, retryCount + 1);
            }
          };
        })(this)
      });
    };


    /*
      * DesignerNews#processStories
      * @desc : processes raw DN story data into a stripped down api
      * @param : [ { stories } ]
      * @param : limit
      * @calls : cb([{ title, url, dnurl, upvotes, author, commentCount }])
     */

    DesignerNews.prototype.processStories = function(stories, cb) {
      var processedStories;
      processedStories = [];
      return _.each(stories, function(story, index) {
        var processed;
        processed = {
          title: story.title,
          url: story.url,
          dnurl: story.site_url,
          upvotes: story.vote_count,
          author: story.user_display_name,
          commentCount: story.comments.length
        };
        processedStories.push(processed);
        if (index === stories.length - 1) {
          return cb(processedStories);
        }
      });
    };

    return DesignerNews;

  })();

  module.exports = new DesignerNews(dnSettings.client_id, dnSettings.client_secret, dnSettings.redirect_uri, dnSettings.refresh_interval_ms);

}).call(this);

},{"jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var $, ForecastIO, forecastioSettings;

  $ = require('jquery');

  forecastioSettings = JSON.parse(localStorage.getItem('settings')).forecastio;

  ForecastIO = (function() {
    function ForecastIO(apiKey, refresh, location, tonightHour, tomorrowHour) {
      this.apiKey = apiKey;
      this.refresh = refresh;
      this.location = location;
      this.tonightHour = tonightHour;
      this.tomorrowHour = tomorrowHour;
      this.forecastioUri = 'https://api.forecast.io/forecast';
      this.cityName = forecastioSettings.city_name;
    }

    ForecastIO.prototype.getValidTimeString = function(time) {
      return time.toISOString().replace(/\.(.*)$/, '');
    };


    /*
      * ForecastIO#getForecast
      * @desc : ensures that location is set, then calls requestForecast
      * @param : {time} - Date object, gets current if null
      * @calls : cb(err, { temp, "condition" })
     */

    ForecastIO.prototype.getForecast = function(time, cb) {
      var queryString;
      queryString = "" + this.location.latitude + "," + this.location.longitude;
      if (time) {
        queryString += "," + (this.getValidTimeString(time));
      }
      return $.ajax({
        url: "" + this.forecastioUri + "/" + this.apiKey + "/" + queryString,
        type: 'GET',
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': 'Access-Control-Allow-Origin',
          '*': '*'
        },
        dataType: 'json',
        success: function(forecastData) {
          return cb(null, {
            temp: forecastData.currently.apparentTemperature,
            condition: forecastData.currently.icon
          });
        },
        error: function(xhr, errMsg, err) {
          return cb(err);
        }
      });
    };

    return ForecastIO;

  })();

  module.exports = new ForecastIO(forecastioSettings.api_key, forecastioSettings.forecast_refresh, {
    latitude: forecastioSettings.latitude,
    longitude: forecastioSettings.longitude
  }, forecastioSettings.tonight_hour, forecastioSettings.tomorrow_hour);

}).call(this);

},{"jquery":"jquery"}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var $, HackerNews, hnSettings, _;

  $ = require('jquery');

  _ = require('underscore');

  hnSettings = JSON.parse(localStorage.getItem('settings')).hn;

  HackerNews = (function() {
    function HackerNews(refreshInterval) {
      this.refreshInterval = refreshInterval;
      this.hnUri = 'https://hacker-news.firebaseio.com/v0';
    }


    /*
      * HackerNews#getTopStories
      * @desc : retrieves the top stories from Hacker News
      * @param : limit - max number of stories to grab
      * @param : retryCount [Default: 0]
      * @calls : cb(err, )
     */

    HackerNews.prototype.getTopStories = function(limit, cb, retryCount) {
      if (retryCount == null) {
        retryCount = 0;
      }
      return $.ajax({
        dataType: 'json',
        url: "" + this.hnUri + "/topstories.json",
        timeout: 3000,
        success: (function(_this) {
          return function(data) {
            var storyIds;
            storyIds = data.slice(0, limit);
            return _this.getStories(storyIds, function(err, stories) {
              if (err) {
                return cb(err);
              } else if (stories.length === 0) {
                return cb(new Error('Received zero stories'));
              } else {
                return cb(null, stories);
              }
            });
          };
        })(this),
        error: (function(_this) {
          return function(xhr, msg, err) {
            var errMsg;
            errMsg = 'Could not reach HN.\nAre you offline?';
            if (msg !== 'timeout') {
              return cb(new Error(errMsg));
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error(errMsg));
            } else {
              console.log("Retry count is " + retryCount + " - try again");
              return _this.getTopStories(limit, cb, retryCount + 1);
            }
          };
        })(this)
      });
    };


    /*
      * HackerNews#getRecentStories
      * @desc : retrieves the latest stream of stories from hacker news
      * @param : limit - max number of stories to grab
      * @param : retryCount [Default: 0]
      * @calls : cb(err, [{ title, url, score, author, commentCount }])
     */

    HackerNews.prototype.getRecentStories = function(limit, cb, retryCount) {
      if (retryCount == null) {
        retryCount = 0;
      }
      return $.ajax({
        dataType: 'json',
        url: "" + this.hnUri + "/newstories.json",
        timeout: 3000,
        success: (function(_this) {
          return function(data) {
            var storyIds;
            storyIds = data.slice(0, limit);
            return _this.getStories(storyIds, function(err, stories) {
              if (err) {
                return cb(err);
              } else if (stories.length === 0) {
                return cb(new Error('Received zero stories'));
              } else {
                return cb(null, stories);
              }
            });
          };
        })(this),
        error: (function(_this) {
          return function(xhr, msg, err) {
            var errMsg;
            errMsg = 'Could not reach HN.\nAre you offline?';
            if (msg !== 'timeout') {
              return cb(new Error(errMsg));
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error(errMsg));
            } else {
              console.log("Retry count is " + retryCount + " - try again");
              return _this.getRecentStories(limit, cb, retryCount + 1);
            }
          };
        })(this)
      });
    };


    /*
      * HackerNews#getStories
      * @desc : gets the story content for given story ids
      * @param : [ids]
      * @calls : cb(err, [{ title, url, score, author, commentCount }])
     */

    HackerNews.prototype.getStories = function(ids, cb) {
      var ajaxErr, stories;
      stories = [];
      ajaxErr = null;
      return _.each(ids, (function(_this) {
        return function(id, index) {
          return $.ajax({
            dataType: 'json',
            url: "" + _this.hnUri + "/item/" + id + ".json",
            success: function(story) {
              var hnurl, processed;
              hnurl = _this.getHNStoryUrl(story.id);
              processed = {
                title: story.title,
                url: story.url ? story.url : hnurl,
                hnurl: hnurl,
                score: story.score,
                author: story.by,
                commentCount: story.kids ? story.kids.length : 0
              };
              stories.push(processed);
              if (stories.length === ids.length) {
                return cb(null, stories);
              }
            },
            error: function(xhr, msg, err) {
              return cb(err);
            }
          });
        };
      })(this));
    };

    HackerNews.prototype.getHNStoryUrl = function(storyId) {
      return "https://news.ycombinator.com/item?id=" + storyId;
    };

    return HackerNews;

  })();

  module.exports = new HackerNews(hnSettings.refresh_interval_ms);

}).call(this);

},{"jquery":"jquery","underscore":"underscore"}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0

/*
  * Public Settings
  * @desc : this a public version of the settings file showing it's structure,
  *         it is not intended to be used, and I can't post mine as it contains
  *         API keys and credentials! Rename this to settings.coffee and
  *         fill in your own information.
  * @author : Tyler Fowler <tylerfowler.1337@gmail.com>
 */

(function() {
  var setSettings, settingsKeyName;

  settingsKeyName = 'settings';

  window.resetSettings = function() {
    localStorage.clear();
    return location.reload();
  };

  setSettings = function() {
    var settings;
    if (!localStorage.getItem(settingsKeyName)) {
      settings = {

        /* Designer News Settings */
        dn: {
          refresh_interval_ms: 15 * 60 * 1000,
          client_id: '<insert yours>',
          client_secret: '<insert yours>',
          redirect_uri: '<insert yours>'
        },

        /* Hacker News Settings */
        hn: {
          refresh_interval_ms: 15 * 60 * 1000
        },

        /* Forecast.io Settings */
        forecastio: {
          api_key: '<insert yours>',
          forecast_refresh: 60 * 60 * 1000,
          tonight_hour: 21,
          tomorrow_hour: 12,
          city_name: 'KC',
          latitude: '39.0628168',
          longitude: '-94.5809449',
          timezone: '17z'
        }
      };
      return localStorage.setItem(settingsKeyName, JSON.stringify(settings));
    }
  };

  setSettings();

}).call(this);

},{}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0

/*
  * Public Settings
  * @desc : this a public version of the settings file showing it's structure,
  *         it is not intended to be used, and I can't post mine as it contains
  *         API keys and credentials! Rename this to settings.coffee and
  *         fill in your own information.
  * @author : Tyler Fowler <tylerfowler.1337@gmail.com>
 */

(function() {
  var setSettings, settingsKeyName;

  settingsKeyName = 'settings';

  window.resetSettings = function() {
    localStorage.clear();
    return location.reload();
  };

  setSettings = function() {
    var settings;
    if (!localStorage.getItem(settingsKeyName)) {
      settings = {

        /* Designer News Settings */
        dn: {
          refresh_interval_ms: 15 * 60 * 1000,
          client_id: '7235a5a5a7d72a47f921b1e0eb21b213d209e0d3761c6a3bcd3d018d6d31d26f',
          client_secret: '87b4a0a8897f4ac6cdd615cd98b65cbbf0eb80ac949baf3a4f2826a9b1630cd7',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        },

        /* Hacker News Settings */
        hn: {
          refresh_interval_ms: 15 * 60 * 1000
        },

        /* Forecast.io Settings */
        forecastio: {
          api_key: '3ebc3fb427b8f8c49a40446ffe9feac8',
          forecast_refresh: 60 * 60 * 1000,
          tonight_hour: 21,
          tomorrow_hour: 12,
          city_name: 'KC',
          latitude: '39.0628168',
          longitude: '-94.5809449',
          timezone: '17z'
        }
      };
      return localStorage.setItem(settingsKeyName, JSON.stringify(settings));
    }
  };

  setSettings();

}).call(this);

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Jvb2ttYXJrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jYWxlbmRhcl9jYXJkLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jbG9jay5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvZG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2huLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy93ZWF0aGVyX2NhcmQuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2ZvcmVjYXN0aW8uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9obl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3B1YmxpY19zZXR0aW5ncy5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLy8gQ29tcG9uZW50c1xudmFyIENsb2NrICAgICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2xvY2snKTtcbnZhciBETkxpc3QgICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RuJyk7XG52YXIgSE5MaXN0ICAgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9obicpO1xudmFyIFdlYXRoZXJDYXJkICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvd2VhdGhlcl9jYXJkJyk7XG52YXIgQm9va21hcmtMaXN0ICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9ib29rbWFyaycpO1xuXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXBwXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEROTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNlbnRlci1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENsb2NrLCBudWxsKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2lkZ2V0LWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC13aWRnZXRcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlYXRoZXJDYXJkLCBudWxsKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFya0xpc3QsIG51bGwpXG5cbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJpZ2h0LXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5MaXN0LCB7c2hvd1RvcDogZmFsc2UsIG1heFN0b3JpZXM6IDl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciAkICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgQm9va21hcmtMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJvb2ttYXJrTGlzdFwiLFxuICAvLyB0aGlzIGNsYXNzIGRvZXNuJ3QgYWN0dWFsbHkgZG8gYW55dGhpbmcsIGl0J3MganVzdCBhIHdyYXBwZXIgdG8gc2ltcGxpZnlcbiAgLy8gdGhlIG1haW4gdmlldyBtYXJrdXBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWNvbnRhaW5lclwifSwgXG4gICAgICAgIC8qIE5vdGUgdGhhdCB0aGUgYm9va21hcmtzIGFyZSBsYWlkIG91dCBieSBpZCBudW1iZXIgKi8gXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstMVwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1mbGlwYm9hcmRcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwczovL2ZsaXBib2FyZC5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstMlwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1zaW1wbGVcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwczovL2Jhbmsuc2ltcGxlLmNvbS9cIn0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJvb2ttYXJrLCB7Ym9va21hcmtJZDogXCJib29rbWFyay0zXCIsIGN1c3RvbUNsYXNzOiBcImJvb2ttYXJrLW5ld3lvcmtlclwiLCBcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly93d3cubmV3eW9ya2VyLmNvbS9cIn0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJvb2ttYXJrLCB7Ym9va21hcmtJZDogXCJib29rbWFyay00XCIsIGN1c3RvbUNsYXNzOiBcImJvb2ttYXJrLXF6XCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cDovL3F6LmNvbS9cIn0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBCb29rbWFyayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJCb29rbWFya1wiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIGlkOiB0aGlzLnByb3BzLmJvb2ttYXJrSWQsIFxuICAgICAgICBjbGFzc05hbWU6IFwiYm9va21hcmstY2FyZCBcIiArIHRoaXMucHJvcHMuY3VzdG9tQ2xhc3N9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYm9va21hcmstbG9nb1wifSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb29rbWFya0xpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5DYWxlbmRhckNhcmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2FsZW5kYXJDYXJkXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjogbnVsbCxcblxuICAgICAgY2FsZW5kYXJMaXN0OiBbXSxcbiAgICB9O1xuICB9LFxuXG4gIGZpbGxNb2NrdXBEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNhbGVuZGFyTGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1BlcnNvbmFsJyxcbiAgICAgICAgICB1cGNvbWluZ0V2ZW50czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aXRsZTogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgdGltZTogJzEyOjMwJyxcbiAgICAgICAgICAgICAgZGF0ZTogJzQtOC0yMDE1IDAwOjAwOjAwLTA1MDBHTVQnIC8vIHRoaXMgc2hvdWxkIGJlIGEgZGF0ZSBvYmplY3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIFwiTm90IGZpbmlzaGVkIVwiKSApO1xuICB9XG59KTtcblxubW9kdWxlcy5leHBvcnQgPSBDYWxlbmRhckNhcmQ7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgbW9udGhOYW1lcyA9IFsgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInIF07XG5cbnZhciBDbG9jayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDbG9ja1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHRpbWU6IHt9IH07XG4gIH0sXG5cbiAgdXBkYXRlVGltZURhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgdGltZU9iaiA9IHt9O1xuXG4gICAgLy8gaG91cnMgYXJlIGluIG1pbGl0YXJ5IHRpbWVcbiAgICBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID09PSAxMikge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnUE0nO1xuICAgIH0gZWxzZSBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID4gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSBjdXJEYXRlLmdldEhvdXJzKCkgLSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMCkge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH1cblxuXG4gICAgLy8gd2UgYWx3YXlzIHdhbnQgdGhlIHRpbWUgdG8gYmUgMiBkaWdpcyAoaS5lLiAwOSBpbnN0ZWFkIG9mIDkpXG4gICAgbWlucyA9IGN1ckRhdGUuZ2V0TWludXRlcygpO1xuICAgIHRpbWVPYmoubWludXRlcyA9IG1pbnMgPiA5ID8gJycgKyBtaW5zIDogJzAnICsgbWlucztcblxuICAgIHRpbWVPYmoubW9udGggPSBtb250aE5hbWVzW2N1ckRhdGUuZ2V0TW9udGgoKV07XG4gICAgdGltZU9iai5kYXkgPSBjdXJEYXRlLmdldERhdGUoKTtcbiAgICB0aW1lT2JqLnllYXIgPSBjdXJEYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdGltZTogdGltZU9iaiB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51cGRhdGVUaW1lRGF0YSgpO1xuICAgIHNldEludGVydmFsKHRoaXMudXBkYXRlVGltZURhdGEsIDEwMDApOyAvLyB1cGRhdGUgZXZlcnkgc2Vjb25kXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNsb2NrXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpbWVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCB7aWQ6IFwiY3VyLXRpbWVcIn0sIHRoaXMuc3RhdGUudGltZS5ob3VycywgXCI6XCIsIHRoaXMuc3RhdGUudGltZS5taW51dGVzKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1wZXJpb2RcIn0sIHRoaXMuc3RhdGUudGltZS5wZXJpb2QpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGl2aWRlclwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGF0ZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1kYXRlXCJ9LCB0aGlzLnN0YXRlLnRpbWUubW9udGgsIFwiIFwiLCB0aGlzLnN0YXRlLnRpbWUuZGF5LCBcIiwgXCIsIHRoaXMuc3RhdGUudGltZS55ZWFyKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvY2s7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGRuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvZG5fc3RvcmUnKTtcblxuRE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBkbkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkRG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBkbi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGRuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuZG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZERuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcbiAgICB9LmJpbmQodGhpcyksIGRuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBkbi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBoYW5kbGVFcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWVycm9yIGRuLWVycm9yXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtZXJyb3ItaWNvblwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7Y2xhc3NOYW1lOiBcImVycm9yLW1zZ1wifSwgZXJyLnRvU3RyaW5nKCkpXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAodGhpcy5zdGF0ZS5lcnIpXG4gICAgICBlcnJvciA9IHRoaXMuaGFuZGxlRXJyb3IodGhpcy5zdGF0ZS5lcnIpO1xuICAgIGVsc2VcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGRubGlzdCA9IHRoaXMuc3RhdGUuc3Rvcmllcy5tYXAoZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEROSXRlbSwge3N0b3J5SWQ6IGluZGV4LCBcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsIFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLCBcbiAgICAgICAgICBkbnVybDogc3RvcnkuZG51cmwsIFxuICAgICAgICAgIHVwdm90ZXM6IHN0b3J5LnVwdm90ZXMsIFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkuYXV0aG9yLCBcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRDb3VudH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBsb2FkaW5nO1xuICAgIGlmICghZXJyb3IgJiYgZG5saXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgIGxvYWRpbmcgPSB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICBlbHNlXG4gICAgICBsb2FkaW5nID0gJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgZG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGRuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiRGVzaWduZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBkbmxpc3RcIn0sIFxuICAgICAgICAgIGVycm9yLCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBkbmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgRE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnZG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgLy8gVE9ETzogbWFrZSBpdCBzYXkgMSBjb21tZW50IGluc3RlYWQgb2YgMSBjb21tZW50c1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBkbi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy51cHZvdGVzLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5kbnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBETkxpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGhuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvaG5fc3RvcmUnKTtcblxuSE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBobkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkSG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBobi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGhuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfSkuYmluZCh0aGlzKSwgaG4ucmVmcmVzaEludGVydmFsKTtcbiAgfSxcblxuICByZW5kZXJMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtbG9hZGluZy1hbmltIGhuLWxvYWRpbmdcIn1cbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIGhhbmRsZUVycm9yOiBmdW5jdGlvbihlcnIpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtZXJyb3IgaG4tZXJyb3JcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1lcnJvci1pY29uXCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHtjbGFzc05hbWU6IFwiZXJyb3ItbXNnXCJ9LCBlcnIudG9TdHJpbmcoKSlcbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmICh0aGlzLnN0YXRlLmVycilcbiAgICAgIGVycm9yID0gdGhpcy5oYW5kbGVFcnJvcih0aGlzLnN0YXRlLmVycik7XG4gICAgZWxzZVxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICB2YXIgaG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGhudXJsOiBzdG9yeS5obnVybCwgXG4gICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoIWVycm9yICYmIGhubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZSBobi1jb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZS1oZWFkZXIgaG4taGVhZGVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJIYWNrZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBobmxpc3RcIn0sIFxuICAgICAgICAgIGVycm9yLCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBobmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgSE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnaG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pdGVtIGhuLWl0ZW1cIiwgaWQ6IGl0ZW1JZH0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pbmRleFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5wcm9wcy5zdG9yeUlkICsgMSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXRpdGxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIHRoaXMucHJvcHMudGl0bGUpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1tZXRhZGF0YVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS11cHZvdGVzXCJ9LCB0aGlzLnByb3BzLnNjb3JlLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5obnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBITkxpc3Q7XG4iLCJ2YXIgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgZm9yZWNhc3RpbyA9IHJlcXVpcmUoJy4uL21vZGVsL2ZvcmVjYXN0aW8nKTtcblxuLy8gVE9ETzogdGhpcyBjb21wb25lbnQgc2hvdWxkIGhhdmUgMiBwcm9wczpcbi8vIC0gY2l0eU5hbWUgOiBDb2xsb3F1aWFsIG5hbWUgZm9yIHRoZSBjaXR5IChpLmUuICdLQycpXG4vLyAtIGNpdHkgOiBBZGRyZXNzIG9mIHRoZSBjaXR5IChpLmUuIEthbnNhcyBDaXR5LCBNTywgNjQxMTEgVVNBKVxuXG5XZWF0aGVyQ2FyZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJXZWF0aGVyQ2FyZFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IG51bGwsXG4gICAgICBjaXR5OiB1bmRlZmluZWQsXG5cbiAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgIHRlbXA6ICcwMCcsXG4gICAgICAgIGNvbmRpdGlvbjogdW5kZWZpbmVkXG4gICAgICB9LFxuXG4gICAgICBmdXR1cmVXZWF0aGVyOiB7XG4gICAgICAgIHRpbWVPZkRheTogJ1RvbmlnaHQnLFxuICAgICAgICB0ZW1wOiAnMDAnLFxuICAgICAgICBjb25kaXRpb246IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgLy8gR2V0cyB0aGUgZnV0dXJlICd0ZW5zZScgdG8gdXNlIGJhc2VkIG9uIHRoZSBjdXJyZW50IHRpbWU6XG4gIC8vICAgNSBhbSB0byA2IHBtIC0gVG9uaWdodFxuICAvLyAgIDdwbSB0byA0YW0gLSBUb21vcnJvd1xuICBnZXRGdXR1cmVUZW5zZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1ckhvdXIgPSAobmV3IERhdGUoKSkuZ2V0SG91cnMoKTtcbiAgICByZXR1cm4gKGN1ckhvdXIgPj0gNSAmJiBjdXJIb3VyIDw9IDE4KSA/ICdUb25pZ2h0JyA6ICdUb21vcnJvdyc7XG4gIH0sXG5cbiAgZ2V0RnV0dXJlVGltZTogZnVuY3Rpb24oZnV0dXJlVGVuc2UpIHtcbiAgICB2YXIgY3VyVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBpZiAoZnV0dXJlVGVuc2UgPT09ICdUb25pZ2h0Jykge1xuICAgICAgY3VyVGltZS5zZXRIb3Vycyhmb3JlY2FzdGlvLnRvbmlnaHRIb3VyKTtcbiAgICAgIHJldHVybiBjdXJUaW1lO1xuICAgIH0gZWxzZSBpZiAoZnV0dXJlVGVuc2UgPT09ICdUb21vcnJvdycpIHtcbiAgICAgIC8vIHNpbmNlIHdlIHdhbnQgJ3RvbW9ycm93JyB0byBiZSBldmVuIHRlY2huaWNhbGx5IHRoZSBzYW1lIGRheSB3aGVuIGl0J3NcbiAgICAgIC8vIGJldHdlZW4gbWlkbmlnaHQgYW5kIDQgYW0gd2UgbmVlZCBhIGJpdCBvZiBleHRyYSBsb2dpY1xuICAgICAgaWYgKGN1clRpbWUuZ2V0SG91cnMoKSA+PSAxOSkgLy8gYXJlIHdlIGF0IG9yIGFmdGVyIDdwbT9cbiAgICAgICAgY3VyVGltZS5zZXREYXRlKGN1clRpbWUuZ2V0RGF0ZSgpICsgMSk7IC8vIGdldCB1cyB0byB0b21vcnJvd1xuXG4gICAgICBjdXJUaW1lLnNldEhvdXJzKGZvcmVjYXN0aW8udG9tb3Jyb3dIb3VyKTtcbiAgICAgIHJldHVybiBjdXJUaW1lO1xuICAgIH0gZWxzZSB0aGlzLnNldFN0YXRlKHtlcnI6IG5ldyBFcnJvcihmdXR1cmVUZW5zZSArICcgaXMgbm90IHJlY29nbml6ZWQnKX0pO1xuICB9LFxuXG4gIHVwZGF0ZUZvcmVjYXN0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjaXR5OiBmb3JlY2FzdGlvLmNpdHlOYW1lfSk7XG5cbiAgICAvLyB1cGRhdGUgY3VycmVudCB0ZW1wXG4gICAgZm9yZWNhc3Rpby5nZXRGb3JlY2FzdChudWxsLCBmdW5jdGlvbihlcnIsIGZvcmVjYXN0KSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7ZXJyOiBlcnJ9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgICAgdGVtcDogZm9yZWNhc3QudGVtcC50b0ZpeGVkKCksXG4gICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdC5jb25kaXRpb25cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIGdldCB0aGUgZnV0dXJlIHRpbWUgJiBnZXQgZm9yZWNhc3QgZm9yIGl0XG4gICAgdmFyIGZ1dHVyZVRlbnNlID0gdGhpcy5nZXRGdXR1cmVUZW5zZSgpO1xuICAgIHZhciBmdXR1cmVUaW1lID0gdGhpcy5nZXRGdXR1cmVUaW1lKGZ1dHVyZVRlbnNlKTtcblxuICAgIGZvcmVjYXN0aW8uZ2V0Rm9yZWNhc3QoZnV0dXJlVGltZSwgZnVuY3Rpb24oZXJyLCBmb3JlY2FzdCkge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2VycjogZXJyfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmdXR1cmVXZWF0aGVyOiB7XG4gICAgICAgICAgdGltZU9mRGF5OiBmdXR1cmVUZW5zZSxcbiAgICAgICAgICB0ZW1wOiBmb3JlY2FzdC50ZW1wLnRvRml4ZWQoKSxcbiAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0LmNvbmRpdGlvblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVwZGF0ZUZvcmVjYXN0KCk7XG5cbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudXBkYXRlRm9yZWNhc3QoKTtcbiAgICB9LmJpbmQodGhpcyksIGZvcmVjYXN0aW8ucmVmcmVzaCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItY2FyZFwifSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNpdHktY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2l0eVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLmNpdHkpXG4gICAgICAgICAgKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY3VycmVudC1jb250YWluZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWN1cnJlbnRcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbmRpdGlvbiBcIiArIHRoaXMuc3RhdGUuY3VycmVudFdlYXRoZXIuY29uZGl0aW9ufVxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50V2VhdGhlci50ZW1wLCBcIsKwXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmdXR1cmUtY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1mdXR1cmVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJ0aW1lLW9mLWRheSBcIiArXG4gICAgICAgICAgICAgICh0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5ID09PSAnVG9uaWdodCcgPyAnJyA6ICd3aWRlJyl9LCBcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5LCBcIjpcIlxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRlbXAsIFwiwrBcIlxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb25kaXRpb24gXCIgKyB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIuY29uZGl0aW9ufVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXRoZXJDYXJkO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRGVzaWduZXJOZXdzLCBkblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGRuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5kbjtcblxuICBEZXNpZ25lck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRGVzaWduZXJOZXdzKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIHJlZGlyZWN0VXJpLCByZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gY2xpZW50U2VjcmV0O1xuICAgICAgdGhpcy5yZWRpcmVjdFVyaSA9IHJlZGlyZWN0VXJpO1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmRuVXJpID0gJ2h0dHBzOi8vYXBpLW5ld3MubGF5ZXJ2YXVsdC5jb20vYXBpL3YxJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudF9jb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcz9jbGllbnRfaWQ9XCIgKyB0aGlzLmNsaWVudElkLFxuICAgICAgICB0aW1lb3V0OiAzMDAwLFxuICAgICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHhociwgbXNnLCBlcnIpIHtcbiAgICAgICAgICAgIHZhciBlcnJNc2c7XG4gICAgICAgICAgICBlcnJNc2cgPSAnQ291bGQgbm90IHJlYWNoIEROLlxcbkFyZSB5b3Ugb2ZmbGluZT8nO1xuICAgICAgICAgICAgaWYgKG1zZyAhPT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoZXJyTXNnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0cnlDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoZXJyTXNnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gdHJ5IGFnYWluXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0VG9wU3RvcmllcyhsaW1pdCwgY2IsIHJldHJ5Q291bnQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcy9yZWNlbnQ/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCxcbiAgICAgICAgdGltZW91dDogMzAwMCxcbiAgICAgICAgc3VjY2VzczogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzU3RvcmllcyhkYXRhLnN0b3JpZXMuc2xpY2UoMCwgbGltaXQpLCBmdW5jdGlvbihzdG9yaWVzKSB7XG4gICAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICB2YXIgZXJyTXNnO1xuICAgICAgICAgICAgZXJyTXNnID0gJ0NvdWxkIG5vdCByZWFjaCBETi5cXG5BcmUgeW91IG9mZmxpbmU/JztcbiAgICAgICAgICAgIGlmIChtc2cgIT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJldHJ5Q291bnQgPj0gMykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHRyeSBhZ2FpblwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFJlY2VudFN0b3JpZXMobGltaXQsIGNiLCByZXRyeUNvdW50ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcylcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNwcm9jZXNzU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHByb2Nlc3NlcyByYXcgRE4gc3RvcnkgZGF0YSBpbnRvIGEgc3RyaXBwZWQgZG93biBhcGlcbiAgICAgICogQHBhcmFtIDogWyB7IHN0b3JpZXMgfSBdXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0XG4gICAgICAqIEBjYWxscyA6IGNiKFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUucHJvY2Vzc1N0b3JpZXMgPSBmdW5jdGlvbihzdG9yaWVzLCBjYikge1xuICAgICAgdmFyIHByb2Nlc3NlZFN0b3JpZXM7XG4gICAgICBwcm9jZXNzZWRTdG9yaWVzID0gW107XG4gICAgICByZXR1cm4gXy5lYWNoKHN0b3JpZXMsIGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgICB2YXIgcHJvY2Vzc2VkO1xuICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5zaXRlX3VybCxcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS52b3RlX2NvdW50LFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkudXNlcl9kaXNwbGF5X25hbWUsXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50cy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc2VkU3Rvcmllcy5wdXNoKHByb2Nlc3NlZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gc3Rvcmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKHByb2Nlc3NlZFN0b3JpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERlc2lnbmVyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IERlc2lnbmVyTmV3cyhkblNldHRpbmdzLmNsaWVudF9pZCwgZG5TZXR0aW5ncy5jbGllbnRfc2VjcmV0LCBkblNldHRpbmdzLnJlZGlyZWN0X3VyaSwgZG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEZvcmVjYXN0SU8sIGZvcmVjYXN0aW9TZXR0aW5ncztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgZm9yZWNhc3Rpb1NldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuZm9yZWNhc3RpbztcblxuICBGb3JlY2FzdElPID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEZvcmVjYXN0SU8oYXBpS2V5LCByZWZyZXNoLCBsb2NhdGlvbiwgdG9uaWdodEhvdXIsIHRvbW9ycm93SG91cikge1xuICAgICAgdGhpcy5hcGlLZXkgPSBhcGlLZXk7XG4gICAgICB0aGlzLnJlZnJlc2ggPSByZWZyZXNoO1xuICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgdGhpcy50b25pZ2h0SG91ciA9IHRvbmlnaHRIb3VyO1xuICAgICAgdGhpcy50b21vcnJvd0hvdXIgPSB0b21vcnJvd0hvdXI7XG4gICAgICB0aGlzLmZvcmVjYXN0aW9VcmkgPSAnaHR0cHM6Ly9hcGkuZm9yZWNhc3QuaW8vZm9yZWNhc3QnO1xuICAgICAgdGhpcy5jaXR5TmFtZSA9IGZvcmVjYXN0aW9TZXR0aW5ncy5jaXR5X25hbWU7XG4gICAgfVxuXG4gICAgRm9yZWNhc3RJTy5wcm90b3R5cGUuZ2V0VmFsaWRUaW1lU3RyaW5nID0gZnVuY3Rpb24odGltZSkge1xuICAgICAgcmV0dXJuIHRpbWUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC4oLiopJC8sICcnKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBGb3JlY2FzdElPI2dldEZvcmVjYXN0XG4gICAgICAqIEBkZXNjIDogZW5zdXJlcyB0aGF0IGxvY2F0aW9uIGlzIHNldCwgdGhlbiBjYWxscyByZXF1ZXN0Rm9yZWNhc3RcbiAgICAgICogQHBhcmFtIDoge3RpbWV9IC0gRGF0ZSBvYmplY3QsIGdldHMgY3VycmVudCBpZiBudWxsXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgeyB0ZW1wLCBcImNvbmRpdGlvblwiIH0pXG4gICAgICovXG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5nZXRGb3JlY2FzdCA9IGZ1bmN0aW9uKHRpbWUsIGNiKSB7XG4gICAgICB2YXIgcXVlcnlTdHJpbmc7XG4gICAgICBxdWVyeVN0cmluZyA9IFwiXCIgKyB0aGlzLmxvY2F0aW9uLmxhdGl0dWRlICsgXCIsXCIgKyB0aGlzLmxvY2F0aW9uLmxvbmdpdHVkZTtcbiAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9IFwiLFwiICsgKHRoaXMuZ2V0VmFsaWRUaW1lU3RyaW5nKHRpbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmZvcmVjYXN0aW9VcmkgKyBcIi9cIiArIHRoaXMuYXBpS2V5ICsgXCIvXCIgKyBxdWVyeVN0cmluZyxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLFxuICAgICAgICAgICcqJzogJyonXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZvcmVjYXN0RGF0YSkge1xuICAgICAgICAgIHJldHVybiBjYihudWxsLCB7XG4gICAgICAgICAgICB0ZW1wOiBmb3JlY2FzdERhdGEuY3VycmVudGx5LmFwcGFyZW50VGVtcGVyYXR1cmUsXG4gICAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0RGF0YS5jdXJyZW50bHkuaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZvcmVjYXN0SU87XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBGb3JlY2FzdElPKGZvcmVjYXN0aW9TZXR0aW5ncy5hcGlfa2V5LCBmb3JlY2FzdGlvU2V0dGluZ3MuZm9yZWNhc3RfcmVmcmVzaCwge1xuICAgIGxhdGl0dWRlOiBmb3JlY2FzdGlvU2V0dGluZ3MubGF0aXR1ZGUsXG4gICAgbG9uZ2l0dWRlOiBmb3JlY2FzdGlvU2V0dGluZ3MubG9uZ2l0dWRlXG4gIH0sIGZvcmVjYXN0aW9TZXR0aW5ncy50b25pZ2h0X2hvdXIsIGZvcmVjYXN0aW9TZXR0aW5ncy50b21vcnJvd19ob3VyKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEhhY2tlck5ld3MsIGhuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgaG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmhuO1xuXG4gIEhhY2tlck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gSGFja2VyTmV3cyhyZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMucmVmcmVzaEludGVydmFsID0gcmVmcmVzaEludGVydmFsO1xuICAgICAgdGhpcy5oblVyaSA9ICdodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0VG9wU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgdG9wIHN0b3JpZXMgZnJvbSBIYWNrZXIgTmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBwYXJhbSA6IHJldHJ5Q291bnQgW0RlZmF1bHQ6IDBdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvdG9wc3Rvcmllcy5qc29uXCIsXG4gICAgICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgIHN1Y2Nlc3M6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3RvcnlJZHM7XG4gICAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICB2YXIgZXJyTXNnO1xuICAgICAgICAgICAgZXJyTXNnID0gJ0NvdWxkIG5vdCByZWFjaCBITi5cXG5BcmUgeW91IG9mZmxpbmU/JztcbiAgICAgICAgICAgIGlmIChtc2cgIT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJldHJ5Q291bnQgPj0gMykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHRyeSBhZ2FpblwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFRvcFN0b3JpZXMobGltaXQsIGNiLCByZXRyeUNvdW50ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcylcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gaGFja2VyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHNjb3JlLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFJlY2VudFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IsIHJldHJ5Q291bnQpIHtcbiAgICAgIGlmIChyZXRyeUNvdW50ID09IG51bGwpIHtcbiAgICAgICAgcmV0cnlDb3VudCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBcIlwiICsgdGhpcy5oblVyaSArIFwiL25ld3N0b3JpZXMuanNvblwiLFxuICAgICAgICB0aW1lb3V0OiAzMDAwLFxuICAgICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgICAgc3RvcnlJZHMgPSBkYXRhLnNsaWNlKDAsIGxpbWl0KTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyksXG4gICAgICAgIGVycm9yOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oeGhyLCBtc2csIGVycikge1xuICAgICAgICAgICAgdmFyIGVyck1zZztcbiAgICAgICAgICAgIGVyck1zZyA9ICdDb3VsZCBub3QgcmVhY2ggSE4uXFxuQXJlIHlvdSBvZmZsaW5lPyc7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXRyeUNvdW50ID49IDMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSB0cnkgYWdhaW5cIik7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCBjYiwgcmV0cnlDb3VudCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpXG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiBnZXRzIHRoZSBzdG9yeSBjb250ZW50IGZvciBnaXZlbiBzdG9yeSBpZHNcbiAgICAgICogQHBhcmFtIDogW2lkc11cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRTdG9yaWVzID0gZnVuY3Rpb24oaWRzLCBjYikge1xuICAgICAgdmFyIGFqYXhFcnIsIHN0b3JpZXM7XG4gICAgICBzdG9yaWVzID0gW107XG4gICAgICBhamF4RXJyID0gbnVsbDtcbiAgICAgIHJldHVybiBfLmVhY2goaWRzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlkLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHVybDogXCJcIiArIF90aGlzLmhuVXJpICsgXCIvaXRlbS9cIiArIGlkICsgXCIuanNvblwiLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RvcnkpIHtcbiAgICAgICAgICAgICAgdmFyIGhudXJsLCBwcm9jZXNzZWQ7XG4gICAgICAgICAgICAgIGhudXJsID0gX3RoaXMuZ2V0SE5TdG9yeVVybChzdG9yeS5pZCk7XG4gICAgICAgICAgICAgIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgICAgICAgdXJsOiBzdG9yeS51cmwgPyBzdG9yeS51cmwgOiBobnVybCxcbiAgICAgICAgICAgICAgICBobnVybDogaG51cmwsXG4gICAgICAgICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogc3RvcnkuYnksXG4gICAgICAgICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5raWRzID8gc3Rvcnkua2lkcy5sZW5ndGggOiAwXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHN0b3JpZXMucHVzaChwcm9jZXNzZWQpO1xuICAgICAgICAgICAgICBpZiAoc3Rvcmllcy5sZW5ndGggPT09IGlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBtc2csIGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0SE5TdG9yeVVybCA9IGZ1bmN0aW9uKHN0b3J5SWQpIHtcbiAgICAgIHJldHVybiBcImh0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20vaXRlbT9pZD1cIiArIHN0b3J5SWQ7XG4gICAgfTtcblxuICAgIHJldHVybiBIYWNrZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgSGFja2VyTmV3cyhoblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuXG4vKlxuICAqIFB1YmxpYyBTZXR0aW5nc1xuICAqIEBkZXNjIDogdGhpcyBhIHB1YmxpYyB2ZXJzaW9uIG9mIHRoZSBzZXR0aW5ncyBmaWxlIHNob3dpbmcgaXQncyBzdHJ1Y3R1cmUsXG4gICogICAgICAgICBpdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCwgYW5kIEkgY2FuJ3QgcG9zdCBtaW5lIGFzIGl0IGNvbnRhaW5zXG4gICogICAgICAgICBBUEkga2V5cyBhbmQgY3JlZGVudGlhbHMhIFJlbmFtZSB0aGlzIHRvIHNldHRpbmdzLmNvZmZlZSBhbmRcbiAgKiAgICAgICAgIGZpbGwgaW4geW91ciBvd24gaW5mb3JtYXRpb24uXG4gICogQGF1dGhvciA6IFR5bGVyIEZvd2xlciA8dHlsZXJmb3dsZXIuMTMzN0BnbWFpbC5jb20+XG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgc2V0U2V0dGluZ3MsIHNldHRpbmdzS2V5TmFtZTtcblxuICBzZXR0aW5nc0tleU5hbWUgPSAnc2V0dGluZ3MnO1xuXG4gIHdpbmRvdy5yZXNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIHNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldHRpbmdzO1xuICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2V0dGluZ3NLZXlOYW1lKSkge1xuICAgICAgc2V0dGluZ3MgPSB7XG5cbiAgICAgICAgLyogRGVzaWduZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBkbjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIGNsaWVudF9pZDogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaTogJzxpbnNlcnQgeW91cnM+J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEhhY2tlciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGhuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDBcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBGb3JlY2FzdC5pbyBTZXR0aW5ncyAqL1xuICAgICAgICBmb3JlY2FzdGlvOiB7XG4gICAgICAgICAgYXBpX2tleTogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICBmb3JlY2FzdF9yZWZyZXNoOiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICB0b25pZ2h0X2hvdXI6IDIxLFxuICAgICAgICAgIHRvbW9ycm93X2hvdXI6IDEyLFxuICAgICAgICAgIGNpdHlfbmFtZTogJ0tDJyxcbiAgICAgICAgICBsYXRpdHVkZTogJzM5LjA2MjgxNjgnLFxuICAgICAgICAgIGxvbmdpdHVkZTogJy05NC41ODA5NDQ5JyxcbiAgICAgICAgICB0aW1lem9uZTogJzE3eidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzZXR0aW5nc0tleU5hbWUsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgfVxuICB9O1xuXG4gIHNldFNldHRpbmdzKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG5cbi8qXG4gICogUHVibGljIFNldHRpbmdzXG4gICogQGRlc2MgOiB0aGlzIGEgcHVibGljIHZlcnNpb24gb2YgdGhlIHNldHRpbmdzIGZpbGUgc2hvd2luZyBpdCdzIHN0cnVjdHVyZSxcbiAgKiAgICAgICAgIGl0IGlzIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkLCBhbmQgSSBjYW4ndCBwb3N0IG1pbmUgYXMgaXQgY29udGFpbnNcbiAgKiAgICAgICAgIEFQSSBrZXlzIGFuZCBjcmVkZW50aWFscyEgUmVuYW1lIHRoaXMgdG8gc2V0dGluZ3MuY29mZmVlIGFuZFxuICAqICAgICAgICAgZmlsbCBpbiB5b3VyIG93biBpbmZvcm1hdGlvbi5cbiAgKiBAYXV0aG9yIDogVHlsZXIgRm93bGVyIDx0eWxlcmZvd2xlci4xMzM3QGdtYWlsLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBzZXRTZXR0aW5ncywgc2V0dGluZ3NLZXlOYW1lO1xuXG4gIHNldHRpbmdzS2V5TmFtZSA9ICdzZXR0aW5ncyc7XG5cbiAgd2luZG93LnJlc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICByZXR1cm4gbG9jYXRpb24ucmVsb2FkKCk7XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0dGluZ3M7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzZXR0aW5nc0tleU5hbWUpKSB7XG4gICAgICBzZXR0aW5ncyA9IHtcblxuICAgICAgICAvKiBEZXNpZ25lciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGRuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgY2xpZW50X2lkOiAnNzIzNWE1YTVhN2Q3MmE0N2Y5MjFiMWUwZWIyMWIyMTNkMjA5ZTBkMzc2MWM2YTNiY2QzZDAxOGQ2ZDMxZDI2ZicsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJzg3YjRhMGE4ODk3ZjRhYzZjZGQ2MTVjZDk4YjY1Y2JiZjBlYjgwYWM5NDliYWYzYTRmMjgyNmE5YjE2MzBjZDcnLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaTogJ3VybjppZXRmOndnOm9hdXRoOjIuMDpvb2InXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogSGFja2VyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgaG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEZvcmVjYXN0LmlvIFNldHRpbmdzICovXG4gICAgICAgIGZvcmVjYXN0aW86IHtcbiAgICAgICAgICBhcGlfa2V5OiAnM2ViYzNmYjQyN2I4ZjhjNDlhNDA0NDZmZmU5ZmVhYzgnLFxuICAgICAgICAgIGZvcmVjYXN0X3JlZnJlc2g6IDYwICogNjAgKiAxMDAwLFxuICAgICAgICAgIHRvbmlnaHRfaG91cjogMjEsXG4gICAgICAgICAgdG9tb3Jyb3dfaG91cjogMTIsXG4gICAgICAgICAgY2l0eV9uYW1lOiAnS0MnLFxuICAgICAgICAgIGxhdGl0dWRlOiAnMzkuMDYyODE2OCcsXG4gICAgICAgICAgbG9uZ2l0dWRlOiAnLTk0LjU4MDk0NDknLFxuICAgICAgICAgIHRpbWV6b25lOiAnMTd6J1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNldHRpbmdzS2V5TmFtZSwgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcbiAgICB9XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MoKTtcblxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
