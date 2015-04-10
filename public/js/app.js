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
        React.createElement("div", {className: "feed-error-icon"}, 
          React.createElement("p", {className: "error-msg"}, err.toString())
        )
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
        React.createElement("div", {className: "feed-error-icon"}, 
          React.createElement("p", {className: "error-msg"}, err.toString())
        )
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Jvb2ttYXJrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jYWxlbmRhcl9jYXJkLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jbG9jay5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvZG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2huLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy93ZWF0aGVyX2NhcmQuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2ZvcmVjYXN0aW8uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9obl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3B1YmxpY19zZXR0aW5ncy5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8vIENvbXBvbmVudHNcbnZhciBDbG9jayAgICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nsb2NrJyk7XG52YXIgRE5MaXN0ICAgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kbicpO1xudmFyIEhOTGlzdCAgICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaG4nKTtcbnZhciBXZWF0aGVyQ2FyZCAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3dlYXRoZXJfY2FyZCcpO1xudmFyIEJvb2ttYXJrTGlzdCAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYm9va21hcmsnKTtcblxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFwcFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkxpc3QsIHtzaG93VG9wOiBmYWxzZSwgbWF4U3RvcmllczogOX0pXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjZW50ZXItcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDbG9jaywgbnVsbCksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndpZGdldC1jb250YWluZXJcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtd2lkZ2V0XCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWF0aGVyQ2FyZCwgbnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmtMaXN0LCBudWxsKVxuXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyaWdodC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXBwLCBudWxsKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKVxuKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgJCAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIEJvb2ttYXJrTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJCb29rbWFya0xpc3RcIixcbiAgLy8gdGhpcyBjbGFzcyBkb2Vzbid0IGFjdHVhbGx5IGRvIGFueXRoaW5nLCBpdCdzIGp1c3QgYSB3cmFwcGVyIHRvIHNpbXBsaWZ5XG4gIC8vIHRoZSBtYWluIHZpZXcgbWFya3VwXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJib29rbWFyay1jb250YWluZXJcIn0sIFxuICAgICAgICAvKiBOb3RlIHRoYXQgdGhlIGJvb2ttYXJrcyBhcmUgbGFpZCBvdXQgYnkgaWQgbnVtYmVyICovIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmssIHtib29rbWFya0lkOiBcImJvb2ttYXJrLTFcIiwgY3VzdG9tQ2xhc3M6IFwiYm9va21hcmstZmxpcGJvYXJkXCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9mbGlwYm9hcmQuY29tL1wifSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmssIHtib29rbWFya0lkOiBcImJvb2ttYXJrLTJcIiwgY3VzdG9tQ2xhc3M6IFwiYm9va21hcmstc2ltcGxlXCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9iYW5rLnNpbXBsZS5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstM1wiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1uZXd5b3JrZXJcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwOi8vd3d3Lm5ld3lvcmtlci5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstNFwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1xelwiLCBcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly9xei5jb20vXCJ9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQm9va21hcmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQm9va21hcmtcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMubGluaywgdGFyZ2V0OiBcIl9ibGFua1wiLCBpZDogdGhpcy5wcm9wcy5ib29rbWFya0lkLCBcbiAgICAgICAgY2xhc3NOYW1lOiBcImJvb2ttYXJrLWNhcmQgXCIgKyB0aGlzLnByb3BzLmN1c3RvbUNsYXNzfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWxvZ29cIn0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9va21hcmtMaXN0O1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuQ2FsZW5kYXJDYXJkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNhbGVuZGFyQ2FyZFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IG51bGwsXG5cbiAgICAgIGNhbGVuZGFyTGlzdDogW10sXG4gICAgfTtcbiAgfSxcblxuICBmaWxsTW9ja3VwRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjYWxlbmRhckxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQZXJzb25hbCcsXG4gICAgICAgICAgdXBjb21pbmdFdmVudHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdMdW5jaCcsXG4gICAgICAgICAgICAgIHRpbWU6ICcxMjozMCcsXG4gICAgICAgICAgICAgIGRhdGU6ICc0LTgtMjAxNSAwMDowMDowMC0wNTAwR01UJyAvLyB0aGlzIHNob3VsZCBiZSBhIGRhdGUgb2JqZWN0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKCBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIk5vdCBmaW5pc2hlZCFcIikgKTtcbiAgfVxufSk7XG5cbm1vZHVsZXMuZXhwb3J0ID0gQ2FsZW5kYXJDYXJkO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIG1vbnRoTmFtZXMgPSBbICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdO1xuXG52YXIgQ2xvY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2xvY2tcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyB0aW1lOiB7fSB9O1xuICB9LFxuXG4gIHVwZGF0ZVRpbWVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHRpbWVPYmogPSB7fTtcblxuICAgIC8vIGhvdXJzIGFyZSBpbiBtaWxpdGFyeSB0aW1lXG4gICAgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA+IDEyKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpIC0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdQTSc7XG4gICAgfSBlbHNlIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPT09IDApIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZU9iai5ob3VycyA9IGN1ckRhdGUuZ2V0SG91cnMoKTtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9XG5cblxuICAgIC8vIHdlIGFsd2F5cyB3YW50IHRoZSB0aW1lIHRvIGJlIDIgZGlnaXMgKGkuZS4gMDkgaW5zdGVhZCBvZiA5KVxuICAgIG1pbnMgPSBjdXJEYXRlLmdldE1pbnV0ZXMoKTtcbiAgICB0aW1lT2JqLm1pbnV0ZXMgPSBtaW5zID4gOSA/ICcnICsgbWlucyA6ICcwJyArIG1pbnM7XG5cbiAgICB0aW1lT2JqLm1vbnRoID0gbW9udGhOYW1lc1tjdXJEYXRlLmdldE1vbnRoKCldO1xuICAgIHRpbWVPYmouZGF5ID0gY3VyRGF0ZS5nZXREYXRlKCk7XG4gICAgdGltZU9iai55ZWFyID0gY3VyRGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWU6IHRpbWVPYmogfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlVGltZURhdGEoKTtcbiAgICBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZVRpbWVEYXRhLCAxMDAwKTsgLy8gdXBkYXRlIGV2ZXJ5IHNlY29uZFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjbG9ja1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aW1lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2lkOiBcImN1ci10aW1lXCJ9LCB0aGlzLnN0YXRlLnRpbWUuaG91cnMsIFwiOlwiLCB0aGlzLnN0YXRlLnRpbWUubWludXRlcyksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItcGVyaW9kXCJ9LCB0aGlzLnN0YXRlLnRpbWUucGVyaW9kKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRpdmlkZXJcIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRhdGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItZGF0ZVwifSwgdGhpcy5zdGF0ZS50aW1lLm1vbnRoLCBcIiBcIiwgdGhpcy5zdGF0ZS50aW1lLmRheSwgXCIsIFwiLCB0aGlzLnN0YXRlLnRpbWUueWVhcilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2NrO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBkbiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2RuX3N0b3JlJyk7XG5cbkROTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgZG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZERuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgZG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5kbkNiKTtcbiAgICBlbHNlXG4gICAgICBkbi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkRG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfS5iaW5kKHRoaXMpLCBkbi5yZWZyZXNoSW50ZXJ2YWwpO1xuICB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gZG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1lcnJvciBkbi1lcnJvclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWVycm9yLWljb25cIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHtjbGFzc05hbWU6IFwiZXJyb3ItbXNnXCJ9LCBlcnIudG9TdHJpbmcoKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyKVxuICAgICAgZXJyb3IgPSB0aGlzLmhhbmRsZUVycm9yKHRoaXMuc3RhdGUuZXJyKTtcbiAgICBlbHNlXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZDtcblxuICAgIHZhciBkbmxpc3QgPSB0aGlzLnN0YXRlLnN0b3JpZXMubWFwKGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkl0ZW0sIHtzdG9yeUlkOiBpbmRleCwgXG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLCBcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCwgXG4gICAgICAgICAgZG51cmw6IHN0b3J5LmRudXJsLCBcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS51cHZvdGVzLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoIWVycm9yICYmIGRubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGRuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBkbi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkRlc2lnbmVyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgZG5saXN0XCJ9LCBcbiAgICAgICAgICBlcnJvciwgXG4gICAgICAgICAgbG9hZGluZywgXG4gICAgICAgICAgZG5saXN0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEROSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkl0ZW1cIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbUlkID0gJ2RuaXRlbS0nICsgdGhpcy5wcm9wcy5zdG9yeUlkO1xuICAgIHZhciBjb21tZW50VGV4dCA9IHRoaXMucHJvcHMuY29tbWVudENvdW50ID09PSAxID8gJ2NvbW1lbnQnIDogJ2NvbW1lbnRzJztcblxuICAgIC8vIFRPRE86IG1ha2UgaXQgc2F5IDEgY29tbWVudCBpbnN0ZWFkIG9mIDEgY29tbWVudHNcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWl0ZW0gZG4taXRlbVwiLCBpZDogaXRlbUlkfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWluZGV4XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnByb3BzLnN0b3J5SWQgKyAxKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktdGl0bGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB0aGlzLnByb3BzLnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgdGhpcy5wcm9wcy50aXRsZSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LW1ldGFkYXRhXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXVwdm90ZXNcIn0sIHRoaXMucHJvcHMudXB2b3RlcywgXCIgdXB2b3Rlc1wiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVwdm90ZS1pY29uXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWF1dGhvclwifSwgdGhpcy5wcm9wcy5hdXRob3IpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktZGF0YS1kaXZpZGVyXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWNvbW1lbnRzXCIsIGhyZWY6IHRoaXMucHJvcHMuZG51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21tZW50Q291bnQsIFwiIFwiLCBjb21tZW50VGV4dFxuICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE5MaXN0O1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBobiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2huX3N0b3JlJyk7XG5cbkhOTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJITkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgaG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZEhuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgaG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5obkNiKTtcbiAgICBlbHNlXG4gICAgICBobi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWRIblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuICAgIH0pLmJpbmQodGhpcyksIGhuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBobi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBoYW5kbGVFcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWVycm9yIGhuLWVycm9yXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtZXJyb3ItaWNvblwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwge2NsYXNzTmFtZTogXCJlcnJvci1tc2dcIn0sIGVyci50b1N0cmluZygpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAodGhpcy5zdGF0ZS5lcnIpXG4gICAgICBlcnJvciA9IHRoaXMuaGFuZGxlRXJyb3IodGhpcy5zdGF0ZS5lcnIpO1xuICAgIGVsc2VcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGhubGlzdCA9IHRoaXMuc3RhdGUuc3Rvcmllcy5tYXAoZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOSXRlbSwge3N0b3J5SWQ6IGluZGV4LCBcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsIFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLCBcbiAgICAgICAgICBobnVybDogc3RvcnkuaG51cmwsIFxuICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSwgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKCFlcnJvciAmJiBobmxpc3QubGVuZ3RoID09PSAwKVxuICAgICAgbG9hZGluZyA9IHRoaXMucmVuZGVyTG9hZGluZygpO1xuICAgIGVsc2VcbiAgICAgIGxvYWRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgaG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGhuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiSGFja2VyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgaG5saXN0XCJ9LCBcbiAgICAgICAgICBlcnJvciwgXG4gICAgICAgICAgbG9hZGluZywgXG4gICAgICAgICAgaG5saXN0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEhOSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJITkl0ZW1cIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbUlkID0gJ2huaXRlbS0nICsgdGhpcy5wcm9wcy5zdG9yeUlkO1xuICAgIHZhciBjb21tZW50VGV4dCA9IHRoaXMucHJvcHMuY29tbWVudENvdW50ID09PSAxID8gJ2NvbW1lbnQnIDogJ2NvbW1lbnRzJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBobi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy5zY29yZSwgXCIgdXB2b3Rlc1wiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVwdm90ZS1pY29uXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWF1dGhvclwifSwgdGhpcy5wcm9wcy5hdXRob3IpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktZGF0YS1kaXZpZGVyXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWNvbW1lbnRzXCIsIGhyZWY6IHRoaXMucHJvcHMuaG51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21tZW50Q291bnQsIFwiIFwiLCBjb21tZW50VGV4dFxuICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSE5MaXN0O1xuIiwidmFyIFJlYWN0ICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGZvcmVjYXN0aW8gPSByZXF1aXJlKCcuLi9tb2RlbC9mb3JlY2FzdGlvJyk7XG5cbi8vIFRPRE86IHRoaXMgY29tcG9uZW50IHNob3VsZCBoYXZlIDIgcHJvcHM6XG4vLyAtIGNpdHlOYW1lIDogQ29sbG9xdWlhbCBuYW1lIGZvciB0aGUgY2l0eSAoaS5lLiAnS0MnKVxuLy8gLSBjaXR5IDogQWRkcmVzcyBvZiB0aGUgY2l0eSAoaS5lLiBLYW5zYXMgQ2l0eSwgTU8sIDY0MTExIFVTQSlcblxuV2VhdGhlckNhcmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiV2VhdGhlckNhcmRcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiBudWxsLFxuICAgICAgY2l0eTogdW5kZWZpbmVkLFxuXG4gICAgICBjdXJyZW50V2VhdGhlcjoge1xuICAgICAgICB0ZW1wOiAnMDAnLFxuICAgICAgICBjb25kaXRpb246IHVuZGVmaW5lZFxuICAgICAgfSxcblxuICAgICAgZnV0dXJlV2VhdGhlcjoge1xuICAgICAgICB0aW1lT2ZEYXk6ICdUb25pZ2h0JyxcbiAgICAgICAgdGVtcDogJzAwJyxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIC8vIEdldHMgdGhlIGZ1dHVyZSAndGVuc2UnIHRvIHVzZSBiYXNlZCBvbiB0aGUgY3VycmVudCB0aW1lOlxuICAvLyAgIDUgYW0gdG8gNiBwbSAtIFRvbmlnaHRcbiAgLy8gICA3cG0gdG8gNGFtIC0gVG9tb3Jyb3dcbiAgZ2V0RnV0dXJlVGVuc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJIb3VyID0gKG5ldyBEYXRlKCkpLmdldEhvdXJzKCk7XG4gICAgcmV0dXJuIChjdXJIb3VyID49IDUgJiYgY3VySG91ciA8PSAxOCkgPyAnVG9uaWdodCcgOiAnVG9tb3Jyb3cnO1xuICB9LFxuXG4gIGdldEZ1dHVyZVRpbWU6IGZ1bmN0aW9uKGZ1dHVyZVRlbnNlKSB7XG4gICAgdmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgaWYgKGZ1dHVyZVRlbnNlID09PSAnVG9uaWdodCcpIHtcbiAgICAgIGN1clRpbWUuc2V0SG91cnMoZm9yZWNhc3Rpby50b25pZ2h0SG91cik7XG4gICAgICByZXR1cm4gY3VyVGltZTtcbiAgICB9IGVsc2UgaWYgKGZ1dHVyZVRlbnNlID09PSAnVG9tb3Jyb3cnKSB7XG4gICAgICAvLyBzaW5jZSB3ZSB3YW50ICd0b21vcnJvdycgdG8gYmUgZXZlbiB0ZWNobmljYWxseSB0aGUgc2FtZSBkYXkgd2hlbiBpdCdzXG4gICAgICAvLyBiZXR3ZWVuIG1pZG5pZ2h0IGFuZCA0IGFtIHdlIG5lZWQgYSBiaXQgb2YgZXh0cmEgbG9naWNcbiAgICAgIGlmIChjdXJUaW1lLmdldEhvdXJzKCkgPj0gMTkpIC8vIGFyZSB3ZSBhdCBvciBhZnRlciA3cG0/XG4gICAgICAgIGN1clRpbWUuc2V0RGF0ZShjdXJUaW1lLmdldERhdGUoKSArIDEpOyAvLyBnZXQgdXMgdG8gdG9tb3Jyb3dcblxuICAgICAgY3VyVGltZS5zZXRIb3Vycyhmb3JlY2FzdGlvLnRvbW9ycm93SG91cik7XG4gICAgICByZXR1cm4gY3VyVGltZTtcbiAgICB9IGVsc2UgdGhpcy5zZXRTdGF0ZSh7ZXJyOiBuZXcgRXJyb3IoZnV0dXJlVGVuc2UgKyAnIGlzIG5vdCByZWNvZ25pemVkJyl9KTtcbiAgfSxcblxuICB1cGRhdGVGb3JlY2FzdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2l0eTogZm9yZWNhc3Rpby5jaXR5TmFtZX0pO1xuXG4gICAgLy8gdXBkYXRlIGN1cnJlbnQgdGVtcFxuICAgIGZvcmVjYXN0aW8uZ2V0Rm9yZWNhc3QobnVsbCwgZnVuY3Rpb24oZXJyLCBmb3JlY2FzdCkge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2VycjogZXJyfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50V2VhdGhlcjoge1xuICAgICAgICAgIHRlbXA6IGZvcmVjYXN0LnRlbXAudG9GaXhlZCgpLFxuICAgICAgICAgIGNvbmRpdGlvbjogZm9yZWNhc3QuY29uZGl0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBnZXQgdGhlIGZ1dHVyZSB0aW1lICYgZ2V0IGZvcmVjYXN0IGZvciBpdFxuICAgIHZhciBmdXR1cmVUZW5zZSA9IHRoaXMuZ2V0RnV0dXJlVGVuc2UoKTtcbiAgICB2YXIgZnV0dXJlVGltZSA9IHRoaXMuZ2V0RnV0dXJlVGltZShmdXR1cmVUZW5zZSk7XG5cbiAgICBmb3JlY2FzdGlvLmdldEZvcmVjYXN0KGZ1dHVyZVRpbWUsIGZ1bmN0aW9uKGVyciwgZm9yZWNhc3QpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnNldFN0YXRlKHtlcnI6IGVycn0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnV0dXJlV2VhdGhlcjoge1xuICAgICAgICAgIHRpbWVPZkRheTogZnV0dXJlVGVuc2UsXG4gICAgICAgICAgdGVtcDogZm9yZWNhc3QudGVtcC50b0ZpeGVkKCksXG4gICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdC5jb25kaXRpb25cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51cGRhdGVGb3JlY2FzdCgpO1xuXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZvcmVjYXN0KCk7XG4gICAgfS5iaW5kKHRoaXMpLCBmb3JlY2FzdGlvLnJlZnJlc2gpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWNhcmRcIn0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaXR5LWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNpdHlcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5zdGF0ZS5jaXR5KVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImN1cnJlbnQtY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1jdXJyZW50XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb25kaXRpb24gXCIgKyB0aGlzLnN0YXRlLmN1cnJlbnRXZWF0aGVyLmNvbmRpdGlvbn1cbiAgICAgICAgICAgICksIFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGVtcFwifSwgXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFdlYXRoZXIudGVtcCwgXCLCsFwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZnV0dXJlLWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItZnV0dXJlXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwidGltZS1vZi1kYXkgXCIgK1xuICAgICAgICAgICAgICAodGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRpbWVPZkRheSA9PT0gJ1RvbmlnaHQnID8gJycgOiAnd2lkZScpfSwgXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRpbWVPZkRheSwgXCI6XCJcbiAgICAgICAgICAgICksIFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGVtcFwifSwgXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci50ZW1wLCBcIsKwXCJcbiAgICAgICAgICAgICksIFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29uZGl0aW9uIFwiICsgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLmNvbmRpdGlvbn1cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWF0aGVyQ2FyZDtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIERlc2lnbmVyTmV3cywgZG5TZXR0aW5ncywgXztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBkblNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuZG47XG5cbiAgRGVzaWduZXJOZXdzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIERlc2lnbmVyTmV3cyhjbGllbnRJZCwgY2xpZW50U2VjcmV0LCByZWRpcmVjdFVyaSwgcmVmcmVzaEludGVydmFsKSB7XG4gICAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XG4gICAgICB0aGlzLmNsaWVudFNlY3JldCA9IGNsaWVudFNlY3JldDtcbiAgICAgIHRoaXMucmVkaXJlY3RVcmkgPSByZWRpcmVjdFVyaTtcbiAgICAgIHRoaXMucmVmcmVzaEludGVydmFsID0gcmVmcmVzaEludGVydmFsO1xuICAgICAgdGhpcy5kblVyaSA9ICdodHRwczovL2FwaS1uZXdzLmxheWVydmF1bHQuY29tL2FwaS92MSc7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAgKiBEZXNpZ25lck5ld3MjZ2V0VG9wU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgdG9wIHN0b3JpZXMgZnJvbSBkZXNpZ25lciBuZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQHBhcmFtIDogcmV0cnlDb3VudCBbRGVmYXVsdDogMF1cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRfY291bnQgfV0pXG4gICAgICovXG5cbiAgICBEZXNpZ25lck5ld3MucHJvdG90eXBlLmdldFRvcFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IsIHJldHJ5Q291bnQpIHtcbiAgICAgIGlmIChyZXRyeUNvdW50ID09IG51bGwpIHtcbiAgICAgICAgcmV0cnlDb3VudCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXM/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCxcbiAgICAgICAgdGltZW91dDogMzAwMCxcbiAgICAgICAgc3VjY2VzczogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzU3RvcmllcyhkYXRhLnN0b3JpZXMuc2xpY2UoMCwgbGltaXQpLCBmdW5jdGlvbihzdG9yaWVzKSB7XG4gICAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICB2YXIgZXJyTXNnO1xuICAgICAgICAgICAgZXJyTXNnID0gJ0NvdWxkIG5vdCByZWFjaCBETi5cXG5BcmUgeW91IG9mZmxpbmU/JztcbiAgICAgICAgICAgIGlmIChtc2cgIT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJldHJ5Q291bnQgPj0gMykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHRyeSBhZ2FpblwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFRvcFN0b3JpZXMobGltaXQsIGNiLCByZXRyeUNvdW50ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcylcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNnZXRSZWNlbnRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSBsYXRlc3Qgc3RyZWFtIG9mIHN0b3JpZXMgZnJvbSBkZXNpZ25lciBuZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQHBhcmFtIDogcmV0cnlDb3VudCBbRGVmYXVsdDogMF1cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBkbnVybCwgdXB2b3RlcywgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBEZXNpZ25lck5ld3MucHJvdG90eXBlLmdldFJlY2VudFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IsIHJldHJ5Q291bnQpIHtcbiAgICAgIGlmIChyZXRyeUNvdW50ID09IG51bGwpIHtcbiAgICAgICAgcmV0cnlDb3VudCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXMvcmVjZW50P2NsaWVudF9pZD1cIiArIHRoaXMuY2xpZW50SWQsXG4gICAgICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgIHN1Y2Nlc3M6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc1N0b3JpZXMoZGF0YS5zdG9yaWVzLnNsaWNlKDAsIGxpbWl0KSwgZnVuY3Rpb24oc3Rvcmllcykge1xuICAgICAgICAgICAgICBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyksXG4gICAgICAgIGVycm9yOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oeGhyLCBtc2csIGVycikge1xuICAgICAgICAgICAgdmFyIGVyck1zZztcbiAgICAgICAgICAgIGVyck1zZyA9ICdDb3VsZCBub3QgcmVhY2ggRE4uXFxuQXJlIHlvdSBvZmZsaW5lPyc7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXRyeUNvdW50ID49IDMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSB0cnkgYWdhaW5cIik7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCBjYiwgcmV0cnlDb3VudCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpXG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBEZXNpZ25lck5ld3MjcHJvY2Vzc1N0b3JpZXNcbiAgICAgICogQGRlc2MgOiBwcm9jZXNzZXMgcmF3IEROIHN0b3J5IGRhdGEgaW50byBhIHN0cmlwcGVkIGRvd24gYXBpXG4gICAgICAqIEBwYXJhbSA6IFsgeyBzdG9yaWVzIH0gXVxuICAgICAgKiBAcGFyYW0gOiBsaW1pdFxuICAgICAgKiBAY2FsbHMgOiBjYihbeyB0aXRsZSwgdXJsLCBkbnVybCwgdXB2b3RlcywgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBEZXNpZ25lck5ld3MucHJvdG90eXBlLnByb2Nlc3NTdG9yaWVzID0gZnVuY3Rpb24oc3RvcmllcywgY2IpIHtcbiAgICAgIHZhciBwcm9jZXNzZWRTdG9yaWVzO1xuICAgICAgcHJvY2Vzc2VkU3RvcmllcyA9IFtdO1xuICAgICAgcmV0dXJuIF8uZWFjaChzdG9yaWVzLCBmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHByb2Nlc3NlZDtcbiAgICAgICAgcHJvY2Vzc2VkID0ge1xuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSxcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCxcbiAgICAgICAgICBkbnVybDogc3Rvcnkuc2l0ZV91cmwsXG4gICAgICAgICAgdXB2b3Rlczogc3Rvcnkudm90ZV9jb3VudCxcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LnVzZXJfZGlzcGxheV9uYW1lLFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudHMubGVuZ3RoXG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3NlZFN0b3JpZXMucHVzaChwcm9jZXNzZWQpO1xuICAgICAgICBpZiAoaW5kZXggPT09IHN0b3JpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHJldHVybiBjYihwcm9jZXNzZWRTdG9yaWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBEZXNpZ25lck5ld3M7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBEZXNpZ25lck5ld3MoZG5TZXR0aW5ncy5jbGllbnRfaWQsIGRuU2V0dGluZ3MuY2xpZW50X3NlY3JldCwgZG5TZXR0aW5ncy5yZWRpcmVjdF91cmksIGRuU2V0dGluZ3MucmVmcmVzaF9pbnRlcnZhbF9tcyk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBGb3JlY2FzdElPLCBmb3JlY2FzdGlvU2V0dGluZ3M7XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIGZvcmVjYXN0aW9TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmZvcmVjYXN0aW87XG5cbiAgRm9yZWNhc3RJTyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBGb3JlY2FzdElPKGFwaUtleSwgcmVmcmVzaCwgbG9jYXRpb24sIHRvbmlnaHRIb3VyLCB0b21vcnJvd0hvdXIpIHtcbiAgICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgICAgdGhpcy5yZWZyZXNoID0gcmVmcmVzaDtcbiAgICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIHRoaXMudG9uaWdodEhvdXIgPSB0b25pZ2h0SG91cjtcbiAgICAgIHRoaXMudG9tb3Jyb3dIb3VyID0gdG9tb3Jyb3dIb3VyO1xuICAgICAgdGhpcy5mb3JlY2FzdGlvVXJpID0gJ2h0dHBzOi8vYXBpLmZvcmVjYXN0LmlvL2ZvcmVjYXN0JztcbiAgICAgIHRoaXMuY2l0eU5hbWUgPSBmb3JlY2FzdGlvU2V0dGluZ3MuY2l0eV9uYW1lO1xuICAgIH1cblxuICAgIEZvcmVjYXN0SU8ucHJvdG90eXBlLmdldFZhbGlkVGltZVN0cmluZyA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgIHJldHVybiB0aW1lLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuKC4qKSQvLCAnJyk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRm9yZWNhc3RJTyNnZXRGb3JlY2FzdFxuICAgICAgKiBAZGVzYyA6IGVuc3VyZXMgdGhhdCBsb2NhdGlvbiBpcyBzZXQsIHRoZW4gY2FsbHMgcmVxdWVzdEZvcmVjYXN0XG4gICAgICAqIEBwYXJhbSA6IHt0aW1lfSAtIERhdGUgb2JqZWN0LCBnZXRzIGN1cnJlbnQgaWYgbnVsbFxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIHsgdGVtcCwgXCJjb25kaXRpb25cIiB9KVxuICAgICAqL1xuXG4gICAgRm9yZWNhc3RJTy5wcm90b3R5cGUuZ2V0Rm9yZWNhc3QgPSBmdW5jdGlvbih0aW1lLCBjYikge1xuICAgICAgdmFyIHF1ZXJ5U3RyaW5nO1xuICAgICAgcXVlcnlTdHJpbmcgPSBcIlwiICsgdGhpcy5sb2NhdGlvbi5sYXRpdHVkZSArIFwiLFwiICsgdGhpcy5sb2NhdGlvbi5sb25naXR1ZGU7XG4gICAgICBpZiAodGltZSkge1xuICAgICAgICBxdWVyeVN0cmluZyArPSBcIixcIiArICh0aGlzLmdldFZhbGlkVGltZVN0cmluZyh0aW1lKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIlwiICsgdGhpcy5mb3JlY2FzdGlvVXJpICsgXCIvXCIgKyB0aGlzLmFwaUtleSArIFwiL1wiICsgcXVlcnlTdHJpbmcsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyxcbiAgICAgICAgICAnKic6ICcqJ1xuICAgICAgICB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihmb3JlY2FzdERhdGEpIHtcbiAgICAgICAgICByZXR1cm4gY2IobnVsbCwge1xuICAgICAgICAgICAgdGVtcDogZm9yZWNhc3REYXRhLmN1cnJlbnRseS5hcHBhcmVudFRlbXBlcmF0dXJlLFxuICAgICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdERhdGEuY3VycmVudGx5Lmljb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBGb3JlY2FzdElPO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgRm9yZWNhc3RJTyhmb3JlY2FzdGlvU2V0dGluZ3MuYXBpX2tleSwgZm9yZWNhc3Rpb1NldHRpbmdzLmZvcmVjYXN0X3JlZnJlc2gsIHtcbiAgICBsYXRpdHVkZTogZm9yZWNhc3Rpb1NldHRpbmdzLmxhdGl0dWRlLFxuICAgIGxvbmdpdHVkZTogZm9yZWNhc3Rpb1NldHRpbmdzLmxvbmdpdHVkZVxuICB9LCBmb3JlY2FzdGlvU2V0dGluZ3MudG9uaWdodF9ob3VyLCBmb3JlY2FzdGlvU2V0dGluZ3MudG9tb3Jyb3dfaG91cik7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBIYWNrZXJOZXdzLCBoblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGhuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5objtcblxuICBIYWNrZXJOZXdzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEhhY2tlck5ld3MocmVmcmVzaEludGVydmFsKSB7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuaG5VcmkgPSAnaHR0cHM6Ly9oYWNrZXItbmV3cy5maXJlYmFzZWlvLmNvbS92MCc7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gSGFja2VyIE5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIClcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFRvcFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IsIHJldHJ5Q291bnQpIHtcbiAgICAgIGlmIChyZXRyeUNvdW50ID09IG51bGwpIHtcbiAgICAgICAgcmV0cnlDb3VudCA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBcIlwiICsgdGhpcy5oblVyaSArIFwiL3RvcHN0b3JpZXMuanNvblwiLFxuICAgICAgICB0aW1lb3V0OiAzMDAwLFxuICAgICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgICAgc3RvcnlJZHMgPSBkYXRhLnNsaWNlKDAsIGxpbWl0KTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyksXG4gICAgICAgIGVycm9yOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oeGhyLCBtc2csIGVycikge1xuICAgICAgICAgICAgdmFyIGVyck1zZztcbiAgICAgICAgICAgIGVyck1zZyA9ICdDb3VsZCBub3QgcmVhY2ggSE4uXFxuQXJlIHlvdSBvZmZsaW5lPyc7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXRyeUNvdW50ID49IDMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2cpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSB0cnkgYWdhaW5cIik7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRUb3BTdG9yaWVzKGxpbWl0LCBjYiwgcmV0cnlDb3VudCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpXG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGhhY2tlciBuZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQHBhcmFtIDogcmV0cnlDb3VudCBbRGVmYXVsdDogMF1cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiLCByZXRyeUNvdW50KSB7XG4gICAgICBpZiAocmV0cnlDb3VudCA9PSBudWxsKSB7XG4gICAgICAgIHJldHJ5Q291bnQgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogXCJcIiArIHRoaXMuaG5VcmkgKyBcIi9uZXdzdG9yaWVzLmpzb25cIixcbiAgICAgICAgdGltZW91dDogMzAwMCxcbiAgICAgICAgc3VjY2VzczogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBzdG9yeUlkcztcbiAgICAgICAgICAgIHN0b3J5SWRzID0gZGF0YS5zbGljZSgwLCBsaW1pdCk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RvcmllcyhzdG9yeUlkcywgZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHhociwgbXNnLCBlcnIpIHtcbiAgICAgICAgICAgIHZhciBlcnJNc2c7XG4gICAgICAgICAgICBlcnJNc2cgPSAnQ291bGQgbm90IHJlYWNoIEhOLlxcbkFyZSB5b3Ugb2ZmbGluZT8nO1xuICAgICAgICAgICAgaWYgKG1zZyAhPT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoZXJyTXNnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0cnlDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoZXJyTXNnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gdHJ5IGFnYWluXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0UmVjZW50U3RvcmllcyhsaW1pdCwgY2IsIHJldHJ5Q291bnQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogZ2V0cyB0aGUgc3RvcnkgY29udGVudCBmb3IgZ2l2ZW4gc3RvcnkgaWRzXG4gICAgICAqIEBwYXJhbSA6IFtpZHNdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgc2NvcmUsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0U3RvcmllcyA9IGZ1bmN0aW9uKGlkcywgY2IpIHtcbiAgICAgIHZhciBhamF4RXJyLCBzdG9yaWVzO1xuICAgICAgc3RvcmllcyA9IFtdO1xuICAgICAgYWpheEVyciA9IG51bGw7XG4gICAgICByZXR1cm4gXy5lYWNoKGlkcywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpZCwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICB1cmw6IFwiXCIgKyBfdGhpcy5oblVyaSArIFwiL2l0ZW0vXCIgKyBpZCArIFwiLmpzb25cIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHN0b3J5KSB7XG4gICAgICAgICAgICAgIHZhciBobnVybCwgcHJvY2Vzc2VkO1xuICAgICAgICAgICAgICBobnVybCA9IF90aGlzLmdldEhOU3RvcnlVcmwoc3RvcnkuaWQpO1xuICAgICAgICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgICAgICAgIHVybDogc3RvcnkudXJsID8gc3RvcnkudXJsIDogaG51cmwsXG4gICAgICAgICAgICAgICAgaG51cmw6IGhudXJsLFxuICAgICAgICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHN0b3J5LmJ5LFxuICAgICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogc3Rvcnkua2lkcyA/IHN0b3J5LmtpZHMubGVuZ3RoIDogMFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSBpZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgbXNnLCBlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldEhOU3RvcnlVcmwgPSBmdW5jdGlvbihzdG9yeUlkKSB7XG4gICAgICByZXR1cm4gXCJodHRwczovL25ld3MueWNvbWJpbmF0b3IuY29tL2l0ZW0/aWQ9XCIgKyBzdG9yeUlkO1xuICAgIH07XG5cbiAgICByZXR1cm4gSGFja2VyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IEhhY2tlck5ld3MoaG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcblxuLypcbiAgKiBQdWJsaWMgU2V0dGluZ3NcbiAgKiBAZGVzYyA6IHRoaXMgYSBwdWJsaWMgdmVyc2lvbiBvZiB0aGUgc2V0dGluZ3MgZmlsZSBzaG93aW5nIGl0J3Mgc3RydWN0dXJlLFxuICAqICAgICAgICAgaXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQsIGFuZCBJIGNhbid0IHBvc3QgbWluZSBhcyBpdCBjb250YWluc1xuICAqICAgICAgICAgQVBJIGtleXMgYW5kIGNyZWRlbnRpYWxzISBSZW5hbWUgdGhpcyB0byBzZXR0aW5ncy5jb2ZmZWUgYW5kXG4gICogICAgICAgICBmaWxsIGluIHlvdXIgb3duIGluZm9ybWF0aW9uLlxuICAqIEBhdXRob3IgOiBUeWxlciBGb3dsZXIgPHR5bGVyZm93bGVyLjEzMzdAZ21haWwuY29tPlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIHNldFNldHRpbmdzLCBzZXR0aW5nc0tleU5hbWU7XG5cbiAgc2V0dGluZ3NLZXlOYW1lID0gJ3NldHRpbmdzJztcblxuICB3aW5kb3cucmVzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJldHVybiBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfTtcblxuICBzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXR0aW5ncztcbiAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHNldHRpbmdzS2V5TmFtZSkpIHtcbiAgICAgIHNldHRpbmdzID0ge1xuXG4gICAgICAgIC8qIERlc2lnbmVyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgZG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMCxcbiAgICAgICAgICBjbGllbnRfaWQ6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICByZWRpcmVjdF91cmk6ICc8aW5zZXJ0IHlvdXJzPidcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBIYWNrZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBobjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogRm9yZWNhc3QuaW8gU2V0dGluZ3MgKi9cbiAgICAgICAgZm9yZWNhc3Rpbzoge1xuICAgICAgICAgIGFwaV9rZXk6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgZm9yZWNhc3RfcmVmcmVzaDogNjAgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgdG9uaWdodF9ob3VyOiAyMSxcbiAgICAgICAgICB0b21vcnJvd19ob3VyOiAxMixcbiAgICAgICAgICBjaXR5X25hbWU6ICdLQycsXG4gICAgICAgICAgbGF0aXR1ZGU6ICczOS4wNjI4MTY4JyxcbiAgICAgICAgICBsb25naXR1ZGU6ICctOTQuNTgwOTQ0OScsXG4gICAgICAgICAgdGltZXpvbmU6ICcxN3onXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2V0dGluZ3NLZXlOYW1lLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgIH1cbiAgfTtcblxuICBzZXRTZXR0aW5ncygpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuXG4vKlxuICAqIFB1YmxpYyBTZXR0aW5nc1xuICAqIEBkZXNjIDogdGhpcyBhIHB1YmxpYyB2ZXJzaW9uIG9mIHRoZSBzZXR0aW5ncyBmaWxlIHNob3dpbmcgaXQncyBzdHJ1Y3R1cmUsXG4gICogICAgICAgICBpdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCwgYW5kIEkgY2FuJ3QgcG9zdCBtaW5lIGFzIGl0IGNvbnRhaW5zXG4gICogICAgICAgICBBUEkga2V5cyBhbmQgY3JlZGVudGlhbHMhIFJlbmFtZSB0aGlzIHRvIHNldHRpbmdzLmNvZmZlZSBhbmRcbiAgKiAgICAgICAgIGZpbGwgaW4geW91ciBvd24gaW5mb3JtYXRpb24uXG4gICogQGF1dGhvciA6IFR5bGVyIEZvd2xlciA8dHlsZXJmb3dsZXIuMTMzN0BnbWFpbC5jb20+XG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgc2V0U2V0dGluZ3MsIHNldHRpbmdzS2V5TmFtZTtcblxuICBzZXR0aW5nc0tleU5hbWUgPSAnc2V0dGluZ3MnO1xuXG4gIHdpbmRvdy5yZXNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIHNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldHRpbmdzO1xuICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2V0dGluZ3NLZXlOYW1lKSkge1xuICAgICAgc2V0dGluZ3MgPSB7XG5cbiAgICAgICAgLyogRGVzaWduZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBkbjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIGNsaWVudF9pZDogJzcyMzVhNWE1YTdkNzJhNDdmOTIxYjFlMGViMjFiMjEzZDIwOWUwZDM3NjFjNmEzYmNkM2QwMThkNmQzMWQyNmYnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICc4N2I0YTBhODg5N2Y0YWM2Y2RkNjE1Y2Q5OGI2NWNiYmYwZWI4MGFjOTQ5YmFmM2E0ZjI4MjZhOWIxNjMwY2Q3JyxcbiAgICAgICAgICByZWRpcmVjdF91cmk6ICd1cm46aWV0Zjp3ZzpvYXV0aDoyLjA6b29iJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEhhY2tlciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGhuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDBcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBGb3JlY2FzdC5pbyBTZXR0aW5ncyAqL1xuICAgICAgICBmb3JlY2FzdGlvOiB7XG4gICAgICAgICAgYXBpX2tleTogJzNlYmMzZmI0MjdiOGY4YzQ5YTQwNDQ2ZmZlOWZlYWM4JyxcbiAgICAgICAgICBmb3JlY2FzdF9yZWZyZXNoOiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICB0b25pZ2h0X2hvdXI6IDIxLFxuICAgICAgICAgIHRvbW9ycm93X2hvdXI6IDEyLFxuICAgICAgICAgIGNpdHlfbmFtZTogJ0tDJyxcbiAgICAgICAgICBsYXRpdHVkZTogJzM5LjA2MjgxNjgnLFxuICAgICAgICAgIGxvbmdpdHVkZTogJy05NC41ODA5NDQ5JyxcbiAgICAgICAgICB0aW1lem9uZTogJzE3eidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzZXR0aW5nc0tleU5hbWUsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgfVxuICB9O1xuXG4gIHNldFNldHRpbmdzKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iXX0=
