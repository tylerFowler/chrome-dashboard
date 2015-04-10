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

  // renderError: function(err) {
  //   return (
  //
  //   )
  // },

  renderLoading: function() {
    return (
      React.createElement("div", {className: "feed-loading-anim dn-loading"}
      )
    );
  },

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

    var loading;
    if (dnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = '';

    return (
      React.createElement("div", {className: "pane dn-container"}, 
        React.createElement("div", {className: "pane-header dn-header"}, 
          React.createElement("h2", null, "Designer News")
        ), 

        React.createElement("div", {className: "story-list dnlist"}, 
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

  render: function() {
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
    if (hnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = undefined;

    return (
      React.createElement("div", {className: "pane hn-container"}, 
        React.createElement("div", {className: "pane-header hn-header"}, 
          React.createElement("h2", null, "Hacker News")
        ), 

        React.createElement("div", {className: "story-list hnlist"}, 
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
            if (msg !== 'timeout') {
              return cb(err);
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error('Could not reach DN.\nAre you offline?'));
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
            if (msg !== 'timeout') {
              return cb(err);
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error('Could not reach DN.\nAre you offline?'));
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
            if (msg !== 'timeout') {
              return cb(err);
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error('Could not reach HN.\nAre you offline?'));
            } else {
              console.log("Rety count is " + retryCount + " - try again");
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
            if (msg !== 'timeout') {
              return cb(err);
            }
            if (retryCount >= 3) {
              console.log("Retry count is " + retryCount + " - return an error");
              return cb(new Error('Could not reach HN.\nAre you offline?'));
            } else {
              console.log("Rety count is " + retryCount + " - try again");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Jvb2ttYXJrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jYWxlbmRhcl9jYXJkLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jbG9jay5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvZG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2huLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy93ZWF0aGVyX2NhcmQuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2ZvcmVjYXN0aW8uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9obl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3B1YmxpY19zZXR0aW5ncy5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8vIENvbXBvbmVudHNcbnZhciBDbG9jayAgICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nsb2NrJyk7XG52YXIgRE5MaXN0ICAgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kbicpO1xudmFyIEhOTGlzdCAgICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaG4nKTtcbnZhciBXZWF0aGVyQ2FyZCAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3dlYXRoZXJfY2FyZCcpO1xudmFyIEJvb2ttYXJrTGlzdCAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYm9va21hcmsnKTtcblxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFwcFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkxpc3QsIHtzaG93VG9wOiBmYWxzZSwgbWF4U3RvcmllczogOX0pXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjZW50ZXItcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDbG9jaywgbnVsbCksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndpZGdldC1jb250YWluZXJcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtd2lkZ2V0XCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWF0aGVyQ2FyZCwgbnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmtMaXN0LCBudWxsKVxuXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyaWdodC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXBwLCBudWxsKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKVxuKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgJCAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIEJvb2ttYXJrTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJCb29rbWFya0xpc3RcIixcbiAgLy8gdGhpcyBjbGFzcyBkb2Vzbid0IGFjdHVhbGx5IGRvIGFueXRoaW5nLCBpdCdzIGp1c3QgYSB3cmFwcGVyIHRvIHNpbXBsaWZ5XG4gIC8vIHRoZSBtYWluIHZpZXcgbWFya3VwXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJib29rbWFyay1jb250YWluZXJcIn0sIFxuICAgICAgICAvKiBOb3RlIHRoYXQgdGhlIGJvb2ttYXJrcyBhcmUgbGFpZCBvdXQgYnkgaWQgbnVtYmVyICovIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmssIHtib29rbWFya0lkOiBcImJvb2ttYXJrLTFcIiwgY3VzdG9tQ2xhc3M6IFwiYm9va21hcmstZmxpcGJvYXJkXCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9mbGlwYm9hcmQuY29tL1wifSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm9va21hcmssIHtib29rbWFya0lkOiBcImJvb2ttYXJrLTJcIiwgY3VzdG9tQ2xhc3M6IFwiYm9va21hcmstc2ltcGxlXCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9iYW5rLnNpbXBsZS5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstM1wiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1uZXd5b3JrZXJcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwOi8vd3d3Lm5ld3lvcmtlci5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstNFwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1xelwiLCBcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly9xei5jb20vXCJ9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQm9va21hcmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQm9va21hcmtcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMubGluaywgdGFyZ2V0OiBcIl9ibGFua1wiLCBpZDogdGhpcy5wcm9wcy5ib29rbWFya0lkLCBcbiAgICAgICAgY2xhc3NOYW1lOiBcImJvb2ttYXJrLWNhcmQgXCIgKyB0aGlzLnByb3BzLmN1c3RvbUNsYXNzfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWxvZ29cIn0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9va21hcmtMaXN0O1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuQ2FsZW5kYXJDYXJkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNhbGVuZGFyQ2FyZFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IG51bGwsXG5cbiAgICAgIGNhbGVuZGFyTGlzdDogW10sXG4gICAgfTtcbiAgfSxcblxuICBmaWxsTW9ja3VwRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjYWxlbmRhckxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQZXJzb25hbCcsXG4gICAgICAgICAgdXBjb21pbmdFdmVudHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdMdW5jaCcsXG4gICAgICAgICAgICAgIHRpbWU6ICcxMjozMCcsXG4gICAgICAgICAgICAgIGRhdGU6ICc0LTgtMjAxNSAwMDowMDowMC0wNTAwR01UJyAvLyB0aGlzIHNob3VsZCBiZSBhIGRhdGUgb2JqZWN0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKCBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLCBcIk5vdCBmaW5pc2hlZCFcIikgKTtcbiAgfVxufSk7XG5cbm1vZHVsZXMuZXhwb3J0ID0gQ2FsZW5kYXJDYXJkO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIG1vbnRoTmFtZXMgPSBbICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdO1xuXG52YXIgQ2xvY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2xvY2tcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyB0aW1lOiB7fSB9O1xuICB9LFxuXG4gIHVwZGF0ZVRpbWVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHRpbWVPYmogPSB7fTtcblxuICAgIC8vIGhvdXJzIGFyZSBpbiBtaWxpdGFyeSB0aW1lXG4gICAgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA+IDEyKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpIC0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdQTSc7XG4gICAgfSBlbHNlIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPT09IDApIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZU9iai5ob3VycyA9IGN1ckRhdGUuZ2V0SG91cnMoKTtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9XG5cblxuICAgIC8vIHdlIGFsd2F5cyB3YW50IHRoZSB0aW1lIHRvIGJlIDIgZGlnaXMgKGkuZS4gMDkgaW5zdGVhZCBvZiA5KVxuICAgIG1pbnMgPSBjdXJEYXRlLmdldE1pbnV0ZXMoKTtcbiAgICB0aW1lT2JqLm1pbnV0ZXMgPSBtaW5zID4gOSA/ICcnICsgbWlucyA6ICcwJyArIG1pbnM7XG5cbiAgICB0aW1lT2JqLm1vbnRoID0gbW9udGhOYW1lc1tjdXJEYXRlLmdldE1vbnRoKCldO1xuICAgIHRpbWVPYmouZGF5ID0gY3VyRGF0ZS5nZXREYXRlKCk7XG4gICAgdGltZU9iai55ZWFyID0gY3VyRGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWU6IHRpbWVPYmogfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlVGltZURhdGEoKTtcbiAgICBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZVRpbWVEYXRhLCAxMDAwKTsgLy8gdXBkYXRlIGV2ZXJ5IHNlY29uZFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjbG9ja1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aW1lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2lkOiBcImN1ci10aW1lXCJ9LCB0aGlzLnN0YXRlLnRpbWUuaG91cnMsIFwiOlwiLCB0aGlzLnN0YXRlLnRpbWUubWludXRlcyksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItcGVyaW9kXCJ9LCB0aGlzLnN0YXRlLnRpbWUucGVyaW9kKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRpdmlkZXJcIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRhdGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItZGF0ZVwifSwgdGhpcy5zdGF0ZS50aW1lLm1vbnRoLCBcIiBcIiwgdGhpcy5zdGF0ZS50aW1lLmRheSwgXCIsIFwiLCB0aGlzLnN0YXRlLnRpbWUueWVhcilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2NrO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBkbiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2RuX3N0b3JlJyk7XG5cbkROTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgZG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZERuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgZG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5kbkNiKTtcbiAgICBlbHNlXG4gICAgICBkbi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkRG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfS5iaW5kKHRoaXMpLCBkbi5yZWZyZXNoSW50ZXJ2YWwpO1xuICB9LFxuXG4gIC8vIHJlbmRlckVycm9yOiBmdW5jdGlvbihlcnIpIHtcbiAgLy8gICByZXR1cm4gKFxuICAvL1xuICAvLyAgIClcbiAgLy8gfSxcblxuICByZW5kZXJMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtbG9hZGluZy1hbmltIGRuLWxvYWRpbmdcIn1cbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRubGlzdCA9IHRoaXMuc3RhdGUuc3Rvcmllcy5tYXAoZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEROSXRlbSwge3N0b3J5SWQ6IGluZGV4LCBcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsIFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLCBcbiAgICAgICAgICBkbnVybDogc3RvcnkuZG51cmwsIFxuICAgICAgICAgIHVwdm90ZXM6IHN0b3J5LnVwdm90ZXMsIFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkuYXV0aG9yLCBcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRDb3VudH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBsb2FkaW5nO1xuICAgIGlmIChkbmxpc3QubGVuZ3RoID09PSAwKVxuICAgICAgbG9hZGluZyA9IHRoaXMucmVuZGVyTG9hZGluZygpO1xuICAgIGVsc2VcbiAgICAgIGxvYWRpbmcgPSAnJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZSBkbi1jb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZS1oZWFkZXIgZG4taGVhZGVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJEZXNpZ25lciBOZXdzXCIpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1saXN0IGRubGlzdFwifSwgXG4gICAgICAgICAgbG9hZGluZywgXG4gICAgICAgICAgZG5saXN0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEROSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkl0ZW1cIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbUlkID0gJ2RuaXRlbS0nICsgdGhpcy5wcm9wcy5zdG9yeUlkO1xuICAgIHZhciBjb21tZW50VGV4dCA9IHRoaXMucHJvcHMuY29tbWVudENvdW50ID09PSAxID8gJ2NvbW1lbnQnIDogJ2NvbW1lbnRzJztcblxuICAgIC8vIFRPRE86IG1ha2UgaXQgc2F5IDEgY29tbWVudCBpbnN0ZWFkIG9mIDEgY29tbWVudHNcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWl0ZW0gZG4taXRlbVwiLCBpZDogaXRlbUlkfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWluZGV4XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnByb3BzLnN0b3J5SWQgKyAxKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktdGl0bGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB0aGlzLnByb3BzLnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgdGhpcy5wcm9wcy50aXRsZSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LW1ldGFkYXRhXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXVwdm90ZXNcIn0sIHRoaXMucHJvcHMudXB2b3RlcywgXCIgdXB2b3Rlc1wiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVwdm90ZS1pY29uXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWF1dGhvclwifSwgdGhpcy5wcm9wcy5hdXRob3IpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktZGF0YS1kaXZpZGVyXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWNvbW1lbnRzXCIsIGhyZWY6IHRoaXMucHJvcHMuZG51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21tZW50Q291bnQsIFwiIFwiLCBjb21tZW50VGV4dFxuICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE5MaXN0O1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBobiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2huX3N0b3JlJyk7XG5cbkhOTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJITkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgaG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZEhuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgaG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5obkNiKTtcbiAgICBlbHNlXG4gICAgICBobi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWRIblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuICAgIH0pLmJpbmQodGhpcyksIGhuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBobi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBobmxpc3QgPSB0aGlzLnN0YXRlLnN0b3JpZXMubWFwKGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChITkl0ZW0sIHtzdG9yeUlkOiBpbmRleCwgXG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLCBcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCwgXG4gICAgICAgICAgaG51cmw6IHN0b3J5LmhudXJsLCBcbiAgICAgICAgICBzY29yZTogc3Rvcnkuc2NvcmUsIFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkuYXV0aG9yLCBcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRDb3VudH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBsb2FkaW5nO1xuICAgIGlmIChobmxpc3QubGVuZ3RoID09PSAwKVxuICAgICAgbG9hZGluZyA9IHRoaXMucmVuZGVyTG9hZGluZygpO1xuICAgIGVsc2VcbiAgICAgIGxvYWRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgaG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGhuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiSGFja2VyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgaG5saXN0XCJ9LCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBobmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgSE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnaG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pdGVtIGhuLWl0ZW1cIiwgaWQ6IGl0ZW1JZH0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pbmRleFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5wcm9wcy5zdG9yeUlkICsgMSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXRpdGxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIHRoaXMucHJvcHMudGl0bGUpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1tZXRhZGF0YVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS11cHZvdGVzXCJ9LCB0aGlzLnByb3BzLnNjb3JlLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5obnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBITkxpc3Q7XG4iLCJ2YXIgUmVhY3QgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgZm9yZWNhc3RpbyA9IHJlcXVpcmUoJy4uL21vZGVsL2ZvcmVjYXN0aW8nKTtcblxuLy8gVE9ETzogdGhpcyBjb21wb25lbnQgc2hvdWxkIGhhdmUgMiBwcm9wczpcbi8vIC0gY2l0eU5hbWUgOiBDb2xsb3F1aWFsIG5hbWUgZm9yIHRoZSBjaXR5IChpLmUuICdLQycpXG4vLyAtIGNpdHkgOiBBZGRyZXNzIG9mIHRoZSBjaXR5IChpLmUuIEthbnNhcyBDaXR5LCBNTywgNjQxMTEgVVNBKVxuXG5XZWF0aGVyQ2FyZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJXZWF0aGVyQ2FyZFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IG51bGwsXG4gICAgICBjaXR5OiB1bmRlZmluZWQsXG5cbiAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgIHRlbXA6ICcwMCcsXG4gICAgICAgIGNvbmRpdGlvbjogdW5kZWZpbmVkXG4gICAgICB9LFxuXG4gICAgICBmdXR1cmVXZWF0aGVyOiB7XG4gICAgICAgIHRpbWVPZkRheTogJ1RvbmlnaHQnLFxuICAgICAgICB0ZW1wOiAnMDAnLFxuICAgICAgICBjb25kaXRpb246IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgLy8gR2V0cyB0aGUgZnV0dXJlICd0ZW5zZScgdG8gdXNlIGJhc2VkIG9uIHRoZSBjdXJyZW50IHRpbWU6XG4gIC8vICAgNSBhbSB0byA2IHBtIC0gVG9uaWdodFxuICAvLyAgIDdwbSB0byA0YW0gLSBUb21vcnJvd1xuICBnZXRGdXR1cmVUZW5zZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1ckhvdXIgPSAobmV3IERhdGUoKSkuZ2V0SG91cnMoKTtcbiAgICByZXR1cm4gKGN1ckhvdXIgPj0gNSAmJiBjdXJIb3VyIDw9IDE4KSA/ICdUb25pZ2h0JyA6ICdUb21vcnJvdyc7XG4gIH0sXG5cbiAgZ2V0RnV0dXJlVGltZTogZnVuY3Rpb24oZnV0dXJlVGVuc2UpIHtcbiAgICB2YXIgY3VyVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBpZiAoZnV0dXJlVGVuc2UgPT09ICdUb25pZ2h0Jykge1xuICAgICAgY3VyVGltZS5zZXRIb3Vycyhmb3JlY2FzdGlvLnRvbmlnaHRIb3VyKTtcbiAgICAgIHJldHVybiBjdXJUaW1lO1xuICAgIH0gZWxzZSBpZiAoZnV0dXJlVGVuc2UgPT09ICdUb21vcnJvdycpIHtcbiAgICAgIC8vIHNpbmNlIHdlIHdhbnQgJ3RvbW9ycm93JyB0byBiZSBldmVuIHRlY2huaWNhbGx5IHRoZSBzYW1lIGRheSB3aGVuIGl0J3NcbiAgICAgIC8vIGJldHdlZW4gbWlkbmlnaHQgYW5kIDQgYW0gd2UgbmVlZCBhIGJpdCBvZiBleHRyYSBsb2dpY1xuICAgICAgaWYgKGN1clRpbWUuZ2V0SG91cnMoKSA+PSAxOSkgLy8gYXJlIHdlIGF0IG9yIGFmdGVyIDdwbT9cbiAgICAgICAgY3VyVGltZS5zZXREYXRlKGN1clRpbWUuZ2V0RGF0ZSgpICsgMSk7IC8vIGdldCB1cyB0byB0b21vcnJvd1xuXG4gICAgICBjdXJUaW1lLnNldEhvdXJzKGZvcmVjYXN0aW8udG9tb3Jyb3dIb3VyKTtcbiAgICAgIHJldHVybiBjdXJUaW1lO1xuICAgIH0gZWxzZSB0aGlzLnNldFN0YXRlKHtlcnI6IG5ldyBFcnJvcihmdXR1cmVUZW5zZSArICcgaXMgbm90IHJlY29nbml6ZWQnKX0pO1xuICB9LFxuXG4gIHVwZGF0ZUZvcmVjYXN0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjaXR5OiBmb3JlY2FzdGlvLmNpdHlOYW1lfSk7XG5cbiAgICAvLyB1cGRhdGUgY3VycmVudCB0ZW1wXG4gICAgZm9yZWNhc3Rpby5nZXRGb3JlY2FzdChudWxsLCBmdW5jdGlvbihlcnIsIGZvcmVjYXN0KSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7ZXJyOiBlcnJ9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgICAgdGVtcDogZm9yZWNhc3QudGVtcC50b0ZpeGVkKCksXG4gICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdC5jb25kaXRpb25cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIGdldCB0aGUgZnV0dXJlIHRpbWUgJiBnZXQgZm9yZWNhc3QgZm9yIGl0XG4gICAgdmFyIGZ1dHVyZVRlbnNlID0gdGhpcy5nZXRGdXR1cmVUZW5zZSgpO1xuICAgIHZhciBmdXR1cmVUaW1lID0gdGhpcy5nZXRGdXR1cmVUaW1lKGZ1dHVyZVRlbnNlKTtcblxuICAgIGZvcmVjYXN0aW8uZ2V0Rm9yZWNhc3QoZnV0dXJlVGltZSwgZnVuY3Rpb24oZXJyLCBmb3JlY2FzdCkge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2VycjogZXJyfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmdXR1cmVXZWF0aGVyOiB7XG4gICAgICAgICAgdGltZU9mRGF5OiBmdXR1cmVUZW5zZSxcbiAgICAgICAgICB0ZW1wOiBmb3JlY2FzdC50ZW1wLnRvRml4ZWQoKSxcbiAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0LmNvbmRpdGlvblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVwZGF0ZUZvcmVjYXN0KCk7XG5cbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudXBkYXRlRm9yZWNhc3QoKTtcbiAgICB9LmJpbmQodGhpcyksIGZvcmVjYXN0aW8ucmVmcmVzaCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItY2FyZFwifSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNpdHktY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2l0eVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLmNpdHkpXG4gICAgICAgICAgKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY3VycmVudC1jb250YWluZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWN1cnJlbnRcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbmRpdGlvbiBcIiArIHRoaXMuc3RhdGUuY3VycmVudFdlYXRoZXIuY29uZGl0aW9ufVxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50V2VhdGhlci50ZW1wLCBcIsKwXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmdXR1cmUtY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1mdXR1cmVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJ0aW1lLW9mLWRheSBcIiArXG4gICAgICAgICAgICAgICh0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5ID09PSAnVG9uaWdodCcgPyAnJyA6ICd3aWRlJyl9LCBcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5LCBcIjpcIlxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRlbXAsIFwiwrBcIlxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb25kaXRpb24gXCIgKyB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIuY29uZGl0aW9ufVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXRoZXJDYXJkO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRGVzaWduZXJOZXdzLCBkblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGRuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5kbjtcblxuICBEZXNpZ25lck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRGVzaWduZXJOZXdzKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIHJlZGlyZWN0VXJpLCByZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gY2xpZW50U2VjcmV0O1xuICAgICAgdGhpcy5yZWRpcmVjdFVyaSA9IHJlZGlyZWN0VXJpO1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmRuVXJpID0gJ2h0dHBzOi8vYXBpLW5ld3MubGF5ZXJ2YXVsdC5jb20vYXBpL3YxJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudF9jb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcz9jbGllbnRfaWQ9XCIgKyB0aGlzLmNsaWVudElkLFxuICAgICAgICB0aW1lb3V0OiAzMDAwLFxuICAgICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHhociwgbXNnLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChtc2cgIT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXRyeUNvdW50ID49IDMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignQ291bGQgbm90IHJlYWNoIEROLlxcbkFyZSB5b3Ugb2ZmbGluZT8nKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJ5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gdHJ5IGFnYWluXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0VG9wU3RvcmllcyhsaW1pdCwgY2IsIHJldHJ5Q291bnQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAcGFyYW0gOiByZXRyeUNvdW50IFtEZWZhdWx0OiAwXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcy9yZWNlbnQ/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCxcbiAgICAgICAgdGltZW91dDogMzAwMCxcbiAgICAgICAgc3VjY2VzczogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzU3RvcmllcyhkYXRhLnN0b3JpZXMuc2xpY2UoMCwgbGltaXQpLCBmdW5jdGlvbihzdG9yaWVzKSB7XG4gICAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0cnlDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ0NvdWxkIG5vdCByZWFjaCBETi5cXG5BcmUgeW91IG9mZmxpbmU/JykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyeSBjb3VudCBpcyBcIiArIHJldHJ5Q291bnQgKyBcIiAtIHRyeSBhZ2FpblwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFJlY2VudFN0b3JpZXMobGltaXQsIGNiLCByZXRyeUNvdW50ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcylcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNwcm9jZXNzU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHByb2Nlc3NlcyByYXcgRE4gc3RvcnkgZGF0YSBpbnRvIGEgc3RyaXBwZWQgZG93biBhcGlcbiAgICAgICogQHBhcmFtIDogWyB7IHN0b3JpZXMgfSBdXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0XG4gICAgICAqIEBjYWxscyA6IGNiKFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUucHJvY2Vzc1N0b3JpZXMgPSBmdW5jdGlvbihzdG9yaWVzLCBjYikge1xuICAgICAgdmFyIHByb2Nlc3NlZFN0b3JpZXM7XG4gICAgICBwcm9jZXNzZWRTdG9yaWVzID0gW107XG4gICAgICByZXR1cm4gXy5lYWNoKHN0b3JpZXMsIGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgICB2YXIgcHJvY2Vzc2VkO1xuICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5zaXRlX3VybCxcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS52b3RlX2NvdW50LFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkudXNlcl9kaXNwbGF5X25hbWUsXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50cy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc2VkU3Rvcmllcy5wdXNoKHByb2Nlc3NlZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gc3Rvcmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKHByb2Nlc3NlZFN0b3JpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERlc2lnbmVyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IERlc2lnbmVyTmV3cyhkblNldHRpbmdzLmNsaWVudF9pZCwgZG5TZXR0aW5ncy5jbGllbnRfc2VjcmV0LCBkblNldHRpbmdzLnJlZGlyZWN0X3VyaSwgZG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEZvcmVjYXN0SU8sIGZvcmVjYXN0aW9TZXR0aW5ncztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgZm9yZWNhc3Rpb1NldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuZm9yZWNhc3RpbztcblxuICBGb3JlY2FzdElPID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEZvcmVjYXN0SU8oYXBpS2V5LCByZWZyZXNoLCBsb2NhdGlvbiwgdG9uaWdodEhvdXIsIHRvbW9ycm93SG91cikge1xuICAgICAgdGhpcy5hcGlLZXkgPSBhcGlLZXk7XG4gICAgICB0aGlzLnJlZnJlc2ggPSByZWZyZXNoO1xuICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgdGhpcy50b25pZ2h0SG91ciA9IHRvbmlnaHRIb3VyO1xuICAgICAgdGhpcy50b21vcnJvd0hvdXIgPSB0b21vcnJvd0hvdXI7XG4gICAgICB0aGlzLmZvcmVjYXN0aW9VcmkgPSAnaHR0cHM6Ly9hcGkuZm9yZWNhc3QuaW8vZm9yZWNhc3QnO1xuICAgICAgdGhpcy5jaXR5TmFtZSA9IGZvcmVjYXN0aW9TZXR0aW5ncy5jaXR5X25hbWU7XG4gICAgfVxuXG4gICAgRm9yZWNhc3RJTy5wcm90b3R5cGUuZ2V0VmFsaWRUaW1lU3RyaW5nID0gZnVuY3Rpb24odGltZSkge1xuICAgICAgcmV0dXJuIHRpbWUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC4oLiopJC8sICcnKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBGb3JlY2FzdElPI2dldEZvcmVjYXN0XG4gICAgICAqIEBkZXNjIDogZW5zdXJlcyB0aGF0IGxvY2F0aW9uIGlzIHNldCwgdGhlbiBjYWxscyByZXF1ZXN0Rm9yZWNhc3RcbiAgICAgICogQHBhcmFtIDoge3RpbWV9IC0gRGF0ZSBvYmplY3QsIGdldHMgY3VycmVudCBpZiBudWxsXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgeyB0ZW1wLCBcImNvbmRpdGlvblwiIH0pXG4gICAgICovXG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5nZXRGb3JlY2FzdCA9IGZ1bmN0aW9uKHRpbWUsIGNiKSB7XG4gICAgICB2YXIgcXVlcnlTdHJpbmc7XG4gICAgICBxdWVyeVN0cmluZyA9IFwiXCIgKyB0aGlzLmxvY2F0aW9uLmxhdGl0dWRlICsgXCIsXCIgKyB0aGlzLmxvY2F0aW9uLmxvbmdpdHVkZTtcbiAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9IFwiLFwiICsgKHRoaXMuZ2V0VmFsaWRUaW1lU3RyaW5nKHRpbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmZvcmVjYXN0aW9VcmkgKyBcIi9cIiArIHRoaXMuYXBpS2V5ICsgXCIvXCIgKyBxdWVyeVN0cmluZyxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLFxuICAgICAgICAgICcqJzogJyonXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZvcmVjYXN0RGF0YSkge1xuICAgICAgICAgIHJldHVybiBjYihudWxsLCB7XG4gICAgICAgICAgICB0ZW1wOiBmb3JlY2FzdERhdGEuY3VycmVudGx5LmFwcGFyZW50VGVtcGVyYXR1cmUsXG4gICAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0RGF0YS5jdXJyZW50bHkuaWNvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZvcmVjYXN0SU87XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBGb3JlY2FzdElPKGZvcmVjYXN0aW9TZXR0aW5ncy5hcGlfa2V5LCBmb3JlY2FzdGlvU2V0dGluZ3MuZm9yZWNhc3RfcmVmcmVzaCwge1xuICAgIGxhdGl0dWRlOiBmb3JlY2FzdGlvU2V0dGluZ3MubGF0aXR1ZGUsXG4gICAgbG9uZ2l0dWRlOiBmb3JlY2FzdGlvU2V0dGluZ3MubG9uZ2l0dWRlXG4gIH0sIGZvcmVjYXN0aW9TZXR0aW5ncy50b25pZ2h0X2hvdXIsIGZvcmVjYXN0aW9TZXR0aW5ncy50b21vcnJvd19ob3VyKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEhhY2tlck5ld3MsIGhuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgaG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmhuO1xuXG4gIEhhY2tlck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gSGFja2VyTmV3cyhyZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMucmVmcmVzaEludGVydmFsID0gcmVmcmVzaEludGVydmFsO1xuICAgICAgdGhpcy5oblVyaSA9ICdodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0VG9wU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgdG9wIHN0b3JpZXMgZnJvbSBIYWNrZXIgTmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBwYXJhbSA6IHJldHJ5Q291bnQgW0RlZmF1bHQ6IDBdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvdG9wc3Rvcmllcy5qc29uXCIsXG4gICAgICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgIHN1Y2Nlc3M6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3RvcnlJZHM7XG4gICAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0cnlDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ0NvdWxkIG5vdCByZWFjaCBITi5cXG5BcmUgeW91IG9mZmxpbmU/JykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXR5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gdHJ5IGFnYWluXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0VG9wU3RvcmllcyhsaW1pdCwgY2IsIHJldHJ5Q291bnQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRSZWNlbnRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSBsYXRlc3Qgc3RyZWFtIG9mIHN0b3JpZXMgZnJvbSBoYWNrZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBwYXJhbSA6IHJldHJ5Q291bnQgW0RlZmF1bHQ6IDBdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgc2NvcmUsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYiwgcmV0cnlDb3VudCkge1xuICAgICAgaWYgKHJldHJ5Q291bnQgPT0gbnVsbCkge1xuICAgICAgICByZXRyeUNvdW50ID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvbmV3c3Rvcmllcy5qc29uXCIsXG4gICAgICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgIHN1Y2Nlc3M6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgc3RvcnlJZHM7XG4gICAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih4aHIsIG1zZywgZXJyKSB7XG4gICAgICAgICAgICBpZiAobXNnICE9PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0cnlDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0cnkgY291bnQgaXMgXCIgKyByZXRyeUNvdW50ICsgXCIgLSByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ0NvdWxkIG5vdCByZWFjaCBITi5cXG5BcmUgeW91IG9mZmxpbmU/JykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXR5IGNvdW50IGlzIFwiICsgcmV0cnlDb3VudCArIFwiIC0gdHJ5IGFnYWluXCIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0UmVjZW50U3RvcmllcyhsaW1pdCwgY2IsIHJldHJ5Q291bnQgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogZ2V0cyB0aGUgc3RvcnkgY29udGVudCBmb3IgZ2l2ZW4gc3RvcnkgaWRzXG4gICAgICAqIEBwYXJhbSA6IFtpZHNdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgc2NvcmUsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0U3RvcmllcyA9IGZ1bmN0aW9uKGlkcywgY2IpIHtcbiAgICAgIHZhciBhamF4RXJyLCBzdG9yaWVzO1xuICAgICAgc3RvcmllcyA9IFtdO1xuICAgICAgYWpheEVyciA9IG51bGw7XG4gICAgICByZXR1cm4gXy5lYWNoKGlkcywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpZCwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICB1cmw6IFwiXCIgKyBfdGhpcy5oblVyaSArIFwiL2l0ZW0vXCIgKyBpZCArIFwiLmpzb25cIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHN0b3J5KSB7XG4gICAgICAgICAgICAgIHZhciBobnVybCwgcHJvY2Vzc2VkO1xuICAgICAgICAgICAgICBobnVybCA9IF90aGlzLmdldEhOU3RvcnlVcmwoc3RvcnkuaWQpO1xuICAgICAgICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgICAgICAgIHVybDogc3RvcnkudXJsID8gc3RvcnkudXJsIDogaG51cmwsXG4gICAgICAgICAgICAgICAgaG51cmw6IGhudXJsLFxuICAgICAgICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHN0b3J5LmJ5LFxuICAgICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogc3Rvcnkua2lkcyA/IHN0b3J5LmtpZHMubGVuZ3RoIDogMFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSBpZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgbXNnLCBlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldEhOU3RvcnlVcmwgPSBmdW5jdGlvbihzdG9yeUlkKSB7XG4gICAgICByZXR1cm4gXCJodHRwczovL25ld3MueWNvbWJpbmF0b3IuY29tL2l0ZW0/aWQ9XCIgKyBzdG9yeUlkO1xuICAgIH07XG5cbiAgICByZXR1cm4gSGFja2VyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IEhhY2tlck5ld3MoaG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcblxuLypcbiAgKiBQdWJsaWMgU2V0dGluZ3NcbiAgKiBAZGVzYyA6IHRoaXMgYSBwdWJsaWMgdmVyc2lvbiBvZiB0aGUgc2V0dGluZ3MgZmlsZSBzaG93aW5nIGl0J3Mgc3RydWN0dXJlLFxuICAqICAgICAgICAgaXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQsIGFuZCBJIGNhbid0IHBvc3QgbWluZSBhcyBpdCBjb250YWluc1xuICAqICAgICAgICAgQVBJIGtleXMgYW5kIGNyZWRlbnRpYWxzISBSZW5hbWUgdGhpcyB0byBzZXR0aW5ncy5jb2ZmZWUgYW5kXG4gICogICAgICAgICBmaWxsIGluIHlvdXIgb3duIGluZm9ybWF0aW9uLlxuICAqIEBhdXRob3IgOiBUeWxlciBGb3dsZXIgPHR5bGVyZm93bGVyLjEzMzdAZ21haWwuY29tPlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIHNldFNldHRpbmdzLCBzZXR0aW5nc0tleU5hbWU7XG5cbiAgc2V0dGluZ3NLZXlOYW1lID0gJ3NldHRpbmdzJztcblxuICB3aW5kb3cucmVzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJldHVybiBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfTtcblxuICBzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXR0aW5ncztcbiAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHNldHRpbmdzS2V5TmFtZSkpIHtcbiAgICAgIHNldHRpbmdzID0ge1xuXG4gICAgICAgIC8qIERlc2lnbmVyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgZG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMCxcbiAgICAgICAgICBjbGllbnRfaWQ6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICByZWRpcmVjdF91cmk6ICc8aW5zZXJ0IHlvdXJzPidcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBIYWNrZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBobjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogRm9yZWNhc3QuaW8gU2V0dGluZ3MgKi9cbiAgICAgICAgZm9yZWNhc3Rpbzoge1xuICAgICAgICAgIGFwaV9rZXk6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgZm9yZWNhc3RfcmVmcmVzaDogNjAgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgdG9uaWdodF9ob3VyOiAyMSxcbiAgICAgICAgICB0b21vcnJvd19ob3VyOiAxMixcbiAgICAgICAgICBjaXR5X25hbWU6ICdLQycsXG4gICAgICAgICAgbGF0aXR1ZGU6ICczOS4wNjI4MTY4JyxcbiAgICAgICAgICBsb25naXR1ZGU6ICctOTQuNTgwOTQ0OScsXG4gICAgICAgICAgdGltZXpvbmU6ICcxN3onXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2V0dGluZ3NLZXlOYW1lLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgIH1cbiAgfTtcblxuICBzZXRTZXR0aW5ncygpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuXG4vKlxuICAqIFB1YmxpYyBTZXR0aW5nc1xuICAqIEBkZXNjIDogdGhpcyBhIHB1YmxpYyB2ZXJzaW9uIG9mIHRoZSBzZXR0aW5ncyBmaWxlIHNob3dpbmcgaXQncyBzdHJ1Y3R1cmUsXG4gICogICAgICAgICBpdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCwgYW5kIEkgY2FuJ3QgcG9zdCBtaW5lIGFzIGl0IGNvbnRhaW5zXG4gICogICAgICAgICBBUEkga2V5cyBhbmQgY3JlZGVudGlhbHMhIFJlbmFtZSB0aGlzIHRvIHNldHRpbmdzLmNvZmZlZSBhbmRcbiAgKiAgICAgICAgIGZpbGwgaW4geW91ciBvd24gaW5mb3JtYXRpb24uXG4gICogQGF1dGhvciA6IFR5bGVyIEZvd2xlciA8dHlsZXJmb3dsZXIuMTMzN0BnbWFpbC5jb20+XG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgc2V0U2V0dGluZ3MsIHNldHRpbmdzS2V5TmFtZTtcblxuICBzZXR0aW5nc0tleU5hbWUgPSAnc2V0dGluZ3MnO1xuXG4gIHdpbmRvdy5yZXNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIHNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldHRpbmdzO1xuICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2V0dGluZ3NLZXlOYW1lKSkge1xuICAgICAgc2V0dGluZ3MgPSB7XG5cbiAgICAgICAgLyogRGVzaWduZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBkbjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIGNsaWVudF9pZDogJzcyMzVhNWE1YTdkNzJhNDdmOTIxYjFlMGViMjFiMjEzZDIwOWUwZDM3NjFjNmEzYmNkM2QwMThkNmQzMWQyNmYnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICc4N2I0YTBhODg5N2Y0YWM2Y2RkNjE1Y2Q5OGI2NWNiYmYwZWI4MGFjOTQ5YmFmM2E0ZjI4MjZhOWIxNjMwY2Q3JyxcbiAgICAgICAgICByZWRpcmVjdF91cmk6ICd1cm46aWV0Zjp3ZzpvYXV0aDoyLjA6b29iJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEhhY2tlciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGhuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDBcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBGb3JlY2FzdC5pbyBTZXR0aW5ncyAqL1xuICAgICAgICBmb3JlY2FzdGlvOiB7XG4gICAgICAgICAgYXBpX2tleTogJzNlYmMzZmI0MjdiOGY4YzQ5YTQwNDQ2ZmZlOWZlYWM4JyxcbiAgICAgICAgICBmb3JlY2FzdF9yZWZyZXNoOiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICB0b25pZ2h0X2hvdXI6IDIxLFxuICAgICAgICAgIHRvbW9ycm93X2hvdXI6IDEyLFxuICAgICAgICAgIGNpdHlfbmFtZTogJ0tDJyxcbiAgICAgICAgICBsYXRpdHVkZTogJzM5LjA2MjgxNjgnLFxuICAgICAgICAgIGxvbmdpdHVkZTogJy05NC41ODA5NDQ5JyxcbiAgICAgICAgICB0aW1lem9uZTogJzE3eidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzZXR0aW5nc0tleU5hbWUsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgfVxuICB9O1xuXG4gIHNldFNldHRpbmdzKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iXX0=
