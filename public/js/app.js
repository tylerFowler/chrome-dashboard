(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock       = require('./components/clock');
var DNList      = require('./components/dn');
var HNList      = require('./components/hn');
var WeatherCard = require('./components/weather_card');


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
            ), 

            React.createElement("div", {className: "right-widget sunrise-card"}
            )
          ), 

          React.createElement("div", {className: "bookmark-container"}

          )

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

},{"./components/clock":2,"./components/dn":3,"./components/hn":4,"./components/weather_card":5,"react":"react"}],2:[function(require,module,exports){
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

},{"react":"react"}],3:[function(require,module,exports){
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

    setInterval((function() {
      this.loadDnStories(this.props.maxStories);
    }).bind(this), dn.refreshInterval);
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

},{"../model/dn_store":6,"react":"react"}],4:[function(require,module,exports){
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

},{"../model/hn_store":8,"react":"react"}],5:[function(require,module,exports){
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
    // render gets called before this

    this.updateForecast();
  },

  render: function() {
    return (
      React.createElement("div", {className: "weather-card"}, 
        React.createElement("div", {className: "city"}, 
          React.createElement("span", null, this.state.city)
        ), 

        React.createElement("div", {className: "weather-current"}, 
          React.createElement("div", {className: "condition " + this.state.currentWeather.condition}
          ), 

          React.createElement("div", {className: "temp"}, 
            this.state.currentWeather.temp, "°"
          )
        ), 

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
    );
  }
});

module.exports = WeatherCard;

},{"../model/forecastio":7,"react":"react"}],6:[function(require,module,exports){
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
      * @calls : cb(err, [{ title, url, upvotes, author, comment_count }])
     */

    DesignerNews.prototype.getTopStories = function(limit, cb) {
      return $.getJSON("" + this.dnUri + "/stories?client_id=" + this.clientId, {}).done((function(_this) {
        return function(data) {
          return _this.processStories(data.stories.slice(0, limit), function(stories) {
            if (stories.length === 0) {
              return cb(new Error('Received zero stories'));
            }
            return cb(null, stories);
          });
        };
      })(this)).fail(function(xhr, errMsg, err) {
        return cb(err);
      });
    };


    /*
      * DesignerNews#getRecentStories
      * @desc : retrieves the latest stream of stories from designer news
      * @param : limit - max number of stories to grab
      * @calls : cb(err, [{ title, url, dnurl, upvotes, author, commentCount }])
     */

    DesignerNews.prototype.getRecentStories = function(limit, cb) {
      return $.getJSON("" + this.dnUri + "/stories/recent?client_id=" + this.clientId, {}).done((function(_this) {
        return function(data) {
          return _this.processStories(data.stories.slice(0, limit), function(stories) {
            if (stories.length === 0) {
              return cb(new Error('Received zero stories'));
            }
            return cb(null, stories);
          });
        };
      })(this)).fail(function(xhr, errMsg, err) {
        return cb(err);
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

},{"jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var $, ForecastIO, forecastioSettings;

  $ = require('jquery');

  forecastioSettings = JSON.parse(localStorage.getItem('settings')).forecastio;

  ForecastIO = (function() {
    function ForecastIO(apiKey, forecastRefresh, tonightHour, tomorrowHour) {
      this.apiKey = apiKey;
      this.forecastRefresh = forecastRefresh;
      this.tonightHour = tonightHour;
      this.tomorrowHour = tomorrowHour;
      this.forecastioUri = 'https://api.forecast.io/forecast';
      this.curLocaiton = void 0;
      this.cityName = forecastioSettings.city_name;
    }


    /*
      * ForecastIO#setLocation
      * @desc : gets the current location and sets it to an instance variable
      * @calls : cb()
     */

    ForecastIO.prototype.setLocation = function(cb) {
      return navigator.geolocation.getCurrentPosition((function(_this) {
        return function(position) {
          var coords;
          coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          _this.curLocation = coords;
          if (cb) {
            return cb();
          }
        };
      })(this));
    };

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
      if (this.curLocation) {
        return this.requestForecast(time, cb);
      } else {
        return this.setLocation((function(_this) {
          return function() {
            return _this.requestForecast(time, cb);
          };
        })(this));
      }
    };


    /*
      * ForecastIO#requestForecast
      * @desc : gets the forecast for the specified time
      * @param : {time} - Date object, gets current if null
      * @calls : cb(err, { temp, "condition" })
     */

    ForecastIO.prototype.requestForecast = function(time, cb) {
      var queryString;
      queryString = "" + this.curLocation.latitude + "," + this.curLocation.longitude;
      if (time) {
        queryString += "," + (this.getValidTimeString(time));
      }
      return $.getJSON("" + this.forecastioUri + "/" + this.apiKey + "/" + queryString + "?callback=?", {}).done(function(forecastData) {
        var forecast;
        forecast = {
          temp: forecastData.currently.apparentTemperature,
          condition: forecastData.currently.icon
        };
        return cb(null, forecast);
      }).fail(function(xhr, errMsg, err) {
        return cb(err);
      });
    };

    return ForecastIO;

  })();

  module.exports = new ForecastIO(forecastioSettings.api_key, forecastioSettings.forecast_refresh, forecastioSettings.tonight_hour, forecastioSettings.tomorrow_hour);

}).call(this);

},{"jquery":"jquery"}],8:[function(require,module,exports){
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
      * @calls : cb(err, )
     */

    HackerNews.prototype.getTopStories = function(limit, cb) {
      return $.getJSON("" + this.hnUri + "/topstories.json", {}).done((function(_this) {
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
      })(this)).fail(function(xhr, errMsg, err) {
        return cb(err);
      });
    };


    /*
      * HackerNews#getRecentStories
      * @desc : retrieves the latest stream of stories from hacker news
      * @param : limit - max number of stories to grab
      * @calls : cb(err, [{ title, url, score, author, commentCount }])
     */

    HackerNews.prototype.getRecentStories = function(limit, cb) {
      return $.getJSON("" + this.hnUri + "/newstories.json", {}).done((function(_this) {
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
      })(this)).fail(function(xhr, errMsg, err) {
        return cb(err);
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
          return $.getJSON("" + _this.hnUri + "/item/" + id + ".json", {}).done(function(story) {
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
          }).fail(function(xhr, errMsg, err) {
            return cb(err);
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

},{"jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Nsb2NrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9kbi5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvaG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL3dlYXRoZXJfY2FyZC5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2RuX3N0b3JlLmpzIiwic3JjL2FwcC9fYnVpbGQvbW9kZWwvZm9yZWNhc3Rpby5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2huX3N0b3JlLmpzIiwic3JjL2FwcC9fYnVpbGQvbW9kZWwvcHVibGljX3NldHRpbmdzLmpzIiwic3JjL2FwcC9fYnVpbGQvbW9kZWwvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLy8gQ29tcG9uZW50c1xudmFyIENsb2NrICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nsb2NrJyk7XG52YXIgRE5MaXN0ICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZG4nKTtcbnZhciBITkxpc3QgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9obicpO1xudmFyIFdlYXRoZXJDYXJkID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3dlYXRoZXJfY2FyZCcpO1xuXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXBwXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEROTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNlbnRlci1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENsb2NrLCBudWxsKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2lkZ2V0LWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC13aWRnZXRcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlYXRoZXJDYXJkLCBudWxsKVxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyaWdodC13aWRnZXQgc3VucmlzZS1jYXJkXCJ9XG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYm9va21hcmstY29udGFpbmVyXCJ9XG5cbiAgICAgICAgICApXG5cbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJpZ2h0LXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5MaXN0LCB7c2hvd1RvcDogZmFsc2UsIG1heFN0b3JpZXM6IDl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIG1vbnRoTmFtZXMgPSBbICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdO1xuXG52YXIgQ2xvY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2xvY2tcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyB0aW1lOiB7fSB9O1xuICB9LFxuXG4gIHVwZGF0ZVRpbWVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHRpbWVPYmogPSB7fTtcblxuICAgIC8vIGhvdXJzIGFyZSBpbiBtaWxpdGFyeSB0aW1lXG4gICAgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA+IDEyKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpIC0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdQTSc7XG4gICAgfSBlbHNlIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPT09IDApIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZU9iai5ob3VycyA9IGN1ckRhdGUuZ2V0SG91cnMoKTtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9XG5cblxuICAgIC8vIHdlIGFsd2F5cyB3YW50IHRoZSB0aW1lIHRvIGJlIDIgZGlnaXMgKGkuZS4gMDkgaW5zdGVhZCBvZiA5KVxuICAgIG1pbnMgPSBjdXJEYXRlLmdldE1pbnV0ZXMoKTtcbiAgICB0aW1lT2JqLm1pbnV0ZXMgPSBtaW5zID4gOSA/ICcnICsgbWlucyA6ICcwJyArIG1pbnM7XG5cbiAgICB0aW1lT2JqLm1vbnRoID0gbW9udGhOYW1lc1tjdXJEYXRlLmdldE1vbnRoKCldO1xuICAgIHRpbWVPYmouZGF5ID0gY3VyRGF0ZS5nZXREYXRlKCk7XG4gICAgdGltZU9iai55ZWFyID0gY3VyRGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWU6IHRpbWVPYmogfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlVGltZURhdGEoKTtcbiAgICBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZVRpbWVEYXRhLCAxMDAwKTsgLy8gdXBkYXRlIGV2ZXJ5IHNlY29uZFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjbG9ja1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aW1lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2lkOiBcImN1ci10aW1lXCJ9LCB0aGlzLnN0YXRlLnRpbWUuaG91cnMsIFwiOlwiLCB0aGlzLnN0YXRlLnRpbWUubWludXRlcyksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItcGVyaW9kXCJ9LCB0aGlzLnN0YXRlLnRpbWUucGVyaW9kKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRpdmlkZXJcIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRhdGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItZGF0ZVwifSwgdGhpcy5zdGF0ZS50aW1lLm1vbnRoLCBcIiBcIiwgdGhpcy5zdGF0ZS50aW1lLmRheSwgXCIsIFwiLCB0aGlzLnN0YXRlLnRpbWUueWVhcilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2NrO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBkbiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2RuX3N0b3JlJyk7XG5cbkROTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgZG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZERuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgZG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5kbkNiKTtcbiAgICBlbHNlXG4gICAgICBkbi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubG9hZERuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuICAgIH0pLmJpbmQodGhpcyksIGRuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgLy8gcmVuZGVyRXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAvLyAgIHJldHVybiAoXG4gIC8vXG4gIC8vICAgKVxuICAvLyB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gZG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5kbnVybCwgXG4gICAgICAgICAgdXB2b3Rlczogc3RvcnkudXB2b3RlcywgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKGRubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGRuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBkbi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkRlc2lnbmVyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgZG5saXN0XCJ9LCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBkbmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgRE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnZG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgLy8gVE9ETzogbWFrZSBpdCBzYXkgMSBjb21tZW50IGluc3RlYWQgb2YgMSBjb21tZW50c1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBkbi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy51cHZvdGVzLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5kbnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBETkxpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGhuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvaG5fc3RvcmUnKTtcblxuSE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBobkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkSG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBobi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGhuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfSkuYmluZCh0aGlzKSwgaG4ucmVmcmVzaEludGVydmFsKTtcbiAgfSxcblxuICByZW5kZXJMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtbG9hZGluZy1hbmltIGhuLWxvYWRpbmdcIn1cbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhubGlzdCA9IHRoaXMuc3RhdGUuc3Rvcmllcy5tYXAoZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOSXRlbSwge3N0b3J5SWQ6IGluZGV4LCBcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsIFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLCBcbiAgICAgICAgICBobnVybDogc3RvcnkuaG51cmwsIFxuICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSwgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKGhubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZSBobi1jb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZS1oZWFkZXIgaG4taGVhZGVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJIYWNrZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBobmxpc3RcIn0sIFxuICAgICAgICAgIGxvYWRpbmcsIFxuICAgICAgICAgIGhubGlzdFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBITkl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSE5JdGVtXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1JZCA9ICdobml0ZW0tJyArIHRoaXMucHJvcHMuc3RvcnlJZDtcbiAgICB2YXIgY29tbWVudFRleHQgPSB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCA9PT0gMSA/ICdjb21tZW50JyA6ICdjb21tZW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWl0ZW0gaG4taXRlbVwiLCBpZDogaXRlbUlkfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWluZGV4XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnByb3BzLnN0b3J5SWQgKyAxKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktdGl0bGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB0aGlzLnByb3BzLnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgdGhpcy5wcm9wcy50aXRsZSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LW1ldGFkYXRhXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXVwdm90ZXNcIn0sIHRoaXMucHJvcHMuc2NvcmUsIFwiIHVwdm90ZXNcIiksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1cHZvdGUtaWNvblwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS1hdXRob3JcIn0sIHRoaXMucHJvcHMuYXV0aG9yKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWRhdGEtZGl2aWRlclwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1jb21tZW50c1wiLCBocmVmOiB0aGlzLnByb3BzLmhudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCBcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudENvdW50LCBcIiBcIiwgY29tbWVudFRleHRcbiAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhOTGlzdDtcbiIsInZhciBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBmb3JlY2FzdGlvID0gcmVxdWlyZSgnLi4vbW9kZWwvZm9yZWNhc3RpbycpO1xuXG4vLyBUT0RPOiB0aGlzIGNvbXBvbmVudCBzaG91bGQgaGF2ZSAyIHByb3BzOlxuLy8gLSBjaXR5TmFtZSA6IENvbGxvcXVpYWwgbmFtZSBmb3IgdGhlIGNpdHkgKGkuZS4gJ0tDJylcbi8vIC0gY2l0eSA6IEFkZHJlc3Mgb2YgdGhlIGNpdHkgKGkuZS4gS2Fuc2FzIENpdHksIE1PLCA2NDExMSBVU0EpXG5cbldlYXRoZXJDYXJkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIldlYXRoZXJDYXJkXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjogbnVsbCxcbiAgICAgIGNpdHk6IHVuZGVmaW5lZCxcblxuICAgICAgY3VycmVudFdlYXRoZXI6IHtcbiAgICAgICAgdGVtcDogJzAwJyxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH0sXG5cbiAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgdGltZU9mRGF5OiAnVG9uaWdodCcsXG4gICAgICAgIHRlbXA6ICcwMCcsXG4gICAgICAgIGNvbmRpdGlvbjogdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICAvLyBHZXRzIHRoZSBmdXR1cmUgJ3RlbnNlJyB0byB1c2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGltZTpcbiAgLy8gICA1IGFtIHRvIDYgcG0gLSBUb25pZ2h0XG4gIC8vICAgN3BtIHRvIDRhbSAtIFRvbW9ycm93XG4gIGdldEZ1dHVyZVRlbnNlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VySG91ciA9IChuZXcgRGF0ZSgpKS5nZXRIb3VycygpO1xuICAgIHJldHVybiAoY3VySG91ciA+PSA1ICYmIGN1ckhvdXIgPD0gMTgpID8gJ1RvbmlnaHQnIDogJ1RvbW9ycm93JztcbiAgfSxcblxuICBnZXRGdXR1cmVUaW1lOiBmdW5jdGlvbihmdXR1cmVUZW5zZSkge1xuICAgIHZhciBjdXJUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGlmIChmdXR1cmVUZW5zZSA9PT0gJ1RvbmlnaHQnKSB7XG4gICAgICBjdXJUaW1lLnNldEhvdXJzKGZvcmVjYXN0aW8udG9uaWdodEhvdXIpO1xuICAgICAgcmV0dXJuIGN1clRpbWU7XG4gICAgfSBlbHNlIGlmIChmdXR1cmVUZW5zZSA9PT0gJ1RvbW9ycm93Jykge1xuICAgICAgLy8gc2luY2Ugd2Ugd2FudCAndG9tb3Jyb3cnIHRvIGJlIGV2ZW4gdGVjaG5pY2FsbHkgdGhlIHNhbWUgZGF5IHdoZW4gaXQnc1xuICAgICAgLy8gYmV0d2VlbiBtaWRuaWdodCBhbmQgNCBhbSB3ZSBuZWVkIGEgYml0IG9mIGV4dHJhIGxvZ2ljXG4gICAgICBpZiAoY3VyVGltZS5nZXRIb3VycygpID49IDE5KSAvLyBhcmUgd2UgYXQgb3IgYWZ0ZXIgN3BtP1xuICAgICAgICBjdXJUaW1lLnNldERhdGUoY3VyVGltZS5nZXREYXRlKCkgKyAxKTsgLy8gZ2V0IHVzIHRvIHRvbW9ycm93XG5cbiAgICAgIGN1clRpbWUuc2V0SG91cnMoZm9yZWNhc3Rpby50b21vcnJvd0hvdXIpO1xuICAgICAgcmV0dXJuIGN1clRpbWU7XG4gICAgfSBlbHNlIHRoaXMuc2V0U3RhdGUoe2VycjogbmV3IEVycm9yKGZ1dHVyZVRlbnNlICsgJyBpcyBub3QgcmVjb2duaXplZCcpfSk7XG4gIH0sXG5cbiAgdXBkYXRlRm9yZWNhc3Q6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NpdHk6IGZvcmVjYXN0aW8uY2l0eU5hbWV9KTtcblxuICAgIC8vIHVwZGF0ZSBjdXJyZW50IHRlbXBcbiAgICBmb3JlY2FzdGlvLmdldEZvcmVjYXN0KG51bGwsIGZ1bmN0aW9uKGVyciwgZm9yZWNhc3QpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnNldFN0YXRlKHtlcnI6IGVycn0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFdlYXRoZXI6IHtcbiAgICAgICAgICB0ZW1wOiBmb3JlY2FzdC50ZW1wLnRvRml4ZWQoKSxcbiAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0LmNvbmRpdGlvblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gZ2V0IHRoZSBmdXR1cmUgdGltZSAmIGdldCBmb3JlY2FzdCBmb3IgaXRcbiAgICB2YXIgZnV0dXJlVGVuc2UgPSB0aGlzLmdldEZ1dHVyZVRlbnNlKCk7XG4gICAgdmFyIGZ1dHVyZVRpbWUgPSB0aGlzLmdldEZ1dHVyZVRpbWUoZnV0dXJlVGVuc2UpO1xuXG4gICAgZm9yZWNhc3Rpby5nZXRGb3JlY2FzdChmdXR1cmVUaW1lLCBmdW5jdGlvbihlcnIsIGZvcmVjYXN0KSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7ZXJyOiBlcnJ9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgICB0aW1lT2ZEYXk6IGZ1dHVyZVRlbnNlLFxuICAgICAgICAgIHRlbXA6IGZvcmVjYXN0LnRlbXAudG9GaXhlZCgpLFxuICAgICAgICAgIGNvbmRpdGlvbjogZm9yZWNhc3QuY29uZGl0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vIHJlbmRlciBnZXRzIGNhbGxlZCBiZWZvcmUgdGhpc1xuXG4gICAgdGhpcy51cGRhdGVGb3JlY2FzdCgpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWNhcmRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2l0eVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5zdGF0ZS5jaXR5KVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1jdXJyZW50XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29uZGl0aW9uIFwiICsgdGhpcy5zdGF0ZS5jdXJyZW50V2VhdGhlci5jb25kaXRpb259XG4gICAgICAgICAgKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGVtcFwifSwgXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRXZWF0aGVyLnRlbXAsIFwiwrBcIlxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItZnV0dXJlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInRpbWUtb2YtZGF5IFwiICtcbiAgICAgICAgICAgICh0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5ID09PSAnVG9uaWdodCcgPyAnJyA6ICd3aWRlJyl9LCBcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRpbWVPZkRheSwgXCI6XCJcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci50ZW1wLCBcIsKwXCJcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb25kaXRpb24gXCIgKyB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIuY29uZGl0aW9ufVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXRoZXJDYXJkO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRGVzaWduZXJOZXdzLCBkblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGRuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5kbjtcblxuICBEZXNpZ25lck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRGVzaWduZXJOZXdzKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIHJlZGlyZWN0VXJpLCByZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gY2xpZW50U2VjcmV0O1xuICAgICAgdGhpcy5yZWRpcmVjdFVyaSA9IHJlZGlyZWN0VXJpO1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmRuVXJpID0gJ2h0dHBzOi8vYXBpLW5ld3MubGF5ZXJ2YXVsdC5jb20vYXBpL3YxJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudF9jb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXM/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXMvcmVjZW50P2NsaWVudF9pZD1cIiArIHRoaXMuY2xpZW50SWQsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzU3RvcmllcyhkYXRhLnN0b3JpZXMuc2xpY2UoMCwgbGltaXQpLCBmdW5jdGlvbihzdG9yaWVzKSB7XG4gICAgICAgICAgICBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNwcm9jZXNzU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHByb2Nlc3NlcyByYXcgRE4gc3RvcnkgZGF0YSBpbnRvIGEgc3RyaXBwZWQgZG93biBhcGlcbiAgICAgICogQHBhcmFtIDogWyB7IHN0b3JpZXMgfSBdXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0XG4gICAgICAqIEBjYWxscyA6IGNiKFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUucHJvY2Vzc1N0b3JpZXMgPSBmdW5jdGlvbihzdG9yaWVzLCBjYikge1xuICAgICAgdmFyIHByb2Nlc3NlZFN0b3JpZXM7XG4gICAgICBwcm9jZXNzZWRTdG9yaWVzID0gW107XG4gICAgICByZXR1cm4gXy5lYWNoKHN0b3JpZXMsIGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgICB2YXIgcHJvY2Vzc2VkO1xuICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5zaXRlX3VybCxcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS52b3RlX2NvdW50LFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkudXNlcl9kaXNwbGF5X25hbWUsXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50cy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc2VkU3Rvcmllcy5wdXNoKHByb2Nlc3NlZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gc3Rvcmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKHByb2Nlc3NlZFN0b3JpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERlc2lnbmVyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IERlc2lnbmVyTmV3cyhkblNldHRpbmdzLmNsaWVudF9pZCwgZG5TZXR0aW5ncy5jbGllbnRfc2VjcmV0LCBkblNldHRpbmdzLnJlZGlyZWN0X3VyaSwgZG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEZvcmVjYXN0SU8sIGZvcmVjYXN0aW9TZXR0aW5ncztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgZm9yZWNhc3Rpb1NldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuZm9yZWNhc3RpbztcblxuICBGb3JlY2FzdElPID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEZvcmVjYXN0SU8oYXBpS2V5LCBmb3JlY2FzdFJlZnJlc2gsIHRvbmlnaHRIb3VyLCB0b21vcnJvd0hvdXIpIHtcbiAgICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgICAgdGhpcy5mb3JlY2FzdFJlZnJlc2ggPSBmb3JlY2FzdFJlZnJlc2g7XG4gICAgICB0aGlzLnRvbmlnaHRIb3VyID0gdG9uaWdodEhvdXI7XG4gICAgICB0aGlzLnRvbW9ycm93SG91ciA9IHRvbW9ycm93SG91cjtcbiAgICAgIHRoaXMuZm9yZWNhc3Rpb1VyaSA9ICdodHRwczovL2FwaS5mb3JlY2FzdC5pby9mb3JlY2FzdCc7XG4gICAgICB0aGlzLmN1ckxvY2FpdG9uID0gdm9pZCAwO1xuICAgICAgdGhpcy5jaXR5TmFtZSA9IGZvcmVjYXN0aW9TZXR0aW5ncy5jaXR5X25hbWU7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAgKiBGb3JlY2FzdElPI3NldExvY2F0aW9uXG4gICAgICAqIEBkZXNjIDogZ2V0cyB0aGUgY3VycmVudCBsb2NhdGlvbiBhbmQgc2V0cyBpdCB0byBhbiBpbnN0YW5jZSB2YXJpYWJsZVxuICAgICAgKiBAY2FsbHMgOiBjYigpXG4gICAgICovXG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbigoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgICAgdmFyIGNvb3JkcztcbiAgICAgICAgICBjb29yZHMgPSB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfdGhpcy5jdXJMb2NhdGlvbiA9IGNvb3JkcztcbiAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgIHJldHVybiBjYigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgRm9yZWNhc3RJTy5wcm90b3R5cGUuZ2V0VmFsaWRUaW1lU3RyaW5nID0gZnVuY3Rpb24odGltZSkge1xuICAgICAgcmV0dXJuIHRpbWUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC4oLiopJC8sICcnKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBGb3JlY2FzdElPI2dldEZvcmVjYXN0XG4gICAgICAqIEBkZXNjIDogZW5zdXJlcyB0aGF0IGxvY2F0aW9uIGlzIHNldCwgdGhlbiBjYWxscyByZXF1ZXN0Rm9yZWNhc3RcbiAgICAgICogQHBhcmFtIDoge3RpbWV9IC0gRGF0ZSBvYmplY3QsIGdldHMgY3VycmVudCBpZiBudWxsXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgeyB0ZW1wLCBcImNvbmRpdGlvblwiIH0pXG4gICAgICovXG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5nZXRGb3JlY2FzdCA9IGZ1bmN0aW9uKHRpbWUsIGNiKSB7XG4gICAgICBpZiAodGhpcy5jdXJMb2NhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0Rm9yZWNhc3QodGltZSwgY2IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TG9jYXRpb24oKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlcXVlc3RGb3JlY2FzdCh0aW1lLCBjYik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpO1xuICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEZvcmVjYXN0SU8jcmVxdWVzdEZvcmVjYXN0XG4gICAgICAqIEBkZXNjIDogZ2V0cyB0aGUgZm9yZWNhc3QgZm9yIHRoZSBzcGVjaWZpZWQgdGltZVxuICAgICAgKiBAcGFyYW0gOiB7dGltZX0gLSBEYXRlIG9iamVjdCwgZ2V0cyBjdXJyZW50IGlmIG51bGxcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCB7IHRlbXAsIFwiY29uZGl0aW9uXCIgfSlcbiAgICAgKi9cblxuICAgIEZvcmVjYXN0SU8ucHJvdG90eXBlLnJlcXVlc3RGb3JlY2FzdCA9IGZ1bmN0aW9uKHRpbWUsIGNiKSB7XG4gICAgICB2YXIgcXVlcnlTdHJpbmc7XG4gICAgICBxdWVyeVN0cmluZyA9IFwiXCIgKyB0aGlzLmN1ckxvY2F0aW9uLmxhdGl0dWRlICsgXCIsXCIgKyB0aGlzLmN1ckxvY2F0aW9uLmxvbmdpdHVkZTtcbiAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9IFwiLFwiICsgKHRoaXMuZ2V0VmFsaWRUaW1lU3RyaW5nKHRpbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIHRoaXMuZm9yZWNhc3Rpb1VyaSArIFwiL1wiICsgdGhpcy5hcGlLZXkgKyBcIi9cIiArIHF1ZXJ5U3RyaW5nICsgXCI/Y2FsbGJhY2s9P1wiLCB7fSkuZG9uZShmdW5jdGlvbihmb3JlY2FzdERhdGEpIHtcbiAgICAgICAgdmFyIGZvcmVjYXN0O1xuICAgICAgICBmb3JlY2FzdCA9IHtcbiAgICAgICAgICB0ZW1wOiBmb3JlY2FzdERhdGEuY3VycmVudGx5LmFwcGFyZW50VGVtcGVyYXR1cmUsXG4gICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdERhdGEuY3VycmVudGx5Lmljb25cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZvcmVjYXN0KTtcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRm9yZWNhc3RJTztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IEZvcmVjYXN0SU8oZm9yZWNhc3Rpb1NldHRpbmdzLmFwaV9rZXksIGZvcmVjYXN0aW9TZXR0aW5ncy5mb3JlY2FzdF9yZWZyZXNoLCBmb3JlY2FzdGlvU2V0dGluZ3MudG9uaWdodF9ob3VyLCBmb3JlY2FzdGlvU2V0dGluZ3MudG9tb3Jyb3dfaG91cik7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBIYWNrZXJOZXdzLCBoblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGhuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5objtcblxuICBIYWNrZXJOZXdzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEhhY2tlck5ld3MocmVmcmVzaEludGVydmFsKSB7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuaG5VcmkgPSAnaHR0cHM6Ly9oYWNrZXItbmV3cy5maXJlYmFzZWlvLmNvbS92MCc7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gSGFja2VyIE5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIClcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFRvcFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IpIHtcbiAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIHRoaXMuaG5VcmkgKyBcIi90b3BzdG9yaWVzLmpzb25cIiwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgIHN0b3J5SWRzID0gZGF0YS5zbGljZSgwLCBsaW1pdCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gaGFja2VyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHNjb3JlLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFJlY2VudFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IpIHtcbiAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIHRoaXMuaG5VcmkgKyBcIi9uZXdzdG9yaWVzLmpzb25cIiwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgIHN0b3J5SWRzID0gZGF0YS5zbGljZSgwLCBsaW1pdCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IGdldHMgdGhlIHN0b3J5IGNvbnRlbnQgZm9yIGdpdmVuIHN0b3J5IGlkc1xuICAgICAgKiBAcGFyYW0gOiBbaWRzXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHNjb3JlLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFN0b3JpZXMgPSBmdW5jdGlvbihpZHMsIGNiKSB7XG4gICAgICB2YXIgYWpheEVyciwgc3RvcmllcztcbiAgICAgIHN0b3JpZXMgPSBbXTtcbiAgICAgIGFqYXhFcnIgPSBudWxsO1xuICAgICAgcmV0dXJuIF8uZWFjaChpZHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaWQsIGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgX3RoaXMuaG5VcmkgKyBcIi9pdGVtL1wiICsgaWQgKyBcIi5qc29uXCIsIHt9KS5kb25lKGZ1bmN0aW9uKHN0b3J5KSB7XG4gICAgICAgICAgICB2YXIgaG51cmwsIHByb2Nlc3NlZDtcbiAgICAgICAgICAgIGhudXJsID0gX3RoaXMuZ2V0SE5TdG9yeVVybChzdG9yeS5pZCk7XG4gICAgICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSxcbiAgICAgICAgICAgICAgdXJsOiBzdG9yeS51cmwgPyBzdG9yeS51cmwgOiBobnVybCxcbiAgICAgICAgICAgICAgaG51cmw6IGhudXJsLFxuICAgICAgICAgICAgICBzY29yZTogc3Rvcnkuc2NvcmUsXG4gICAgICAgICAgICAgIGF1dGhvcjogc3RvcnkuYnksXG4gICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogc3Rvcnkua2lkcyA/IHN0b3J5LmtpZHMubGVuZ3RoIDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN0b3JpZXMucHVzaChwcm9jZXNzZWQpO1xuICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSBpZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRITlN0b3J5VXJsID0gZnVuY3Rpb24oc3RvcnlJZCkge1xuICAgICAgcmV0dXJuIFwiaHR0cHM6Ly9uZXdzLnljb21iaW5hdG9yLmNvbS9pdGVtP2lkPVwiICsgc3RvcnlJZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEhhY2tlck5ld3M7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBIYWNrZXJOZXdzKGhuU2V0dGluZ3MucmVmcmVzaF9pbnRlcnZhbF9tcyk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG5cbi8qXG4gICogUHVibGljIFNldHRpbmdzXG4gICogQGRlc2MgOiB0aGlzIGEgcHVibGljIHZlcnNpb24gb2YgdGhlIHNldHRpbmdzIGZpbGUgc2hvd2luZyBpdCdzIHN0cnVjdHVyZSxcbiAgKiAgICAgICAgIGl0IGlzIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkLCBhbmQgSSBjYW4ndCBwb3N0IG1pbmUgYXMgaXQgY29udGFpbnNcbiAgKiAgICAgICAgIEFQSSBrZXlzIGFuZCBjcmVkZW50aWFscyEgUmVuYW1lIHRoaXMgdG8gc2V0dGluZ3MuY29mZmVlIGFuZFxuICAqICAgICAgICAgZmlsbCBpbiB5b3VyIG93biBpbmZvcm1hdGlvbi5cbiAgKiBAYXV0aG9yIDogVHlsZXIgRm93bGVyIDx0eWxlcmZvd2xlci4xMzM3QGdtYWlsLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBzZXRTZXR0aW5ncywgc2V0dGluZ3NLZXlOYW1lO1xuXG4gIHNldHRpbmdzS2V5TmFtZSA9ICdzZXR0aW5ncyc7XG5cbiAgd2luZG93LnJlc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICByZXR1cm4gbG9jYXRpb24ucmVsb2FkKCk7XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0dGluZ3M7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzZXR0aW5nc0tleU5hbWUpKSB7XG4gICAgICBzZXR0aW5ncyA9IHtcblxuICAgICAgICAvKiBEZXNpZ25lciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGRuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgY2xpZW50X2lkOiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiAnPGluc2VydCB5b3Vycz4nXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogSGFja2VyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgaG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEZvcmVjYXN0LmlvIFNldHRpbmdzICovXG4gICAgICAgIGZvcmVjYXN0aW86IHtcbiAgICAgICAgICBhcGlfa2V5OiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIGZvcmVjYXN0X3JlZnJlc2g6IDYwICogNjAgKiAxMDAwLFxuICAgICAgICAgIHRvbmlnaHRfaG91cjogMjEsXG4gICAgICAgICAgdG9tb3Jyb3dfaG91cjogMTIsXG4gICAgICAgICAgY2l0eV9uYW1lOiAnS0MnLFxuICAgICAgICAgIGxhdGl0dWRlOiAnMzkuMDYyODE2OCcsXG4gICAgICAgICAgbG9uZ2l0dWRlOiAnLTk0LjU4MDk0NDknLFxuICAgICAgICAgIHRpbWV6b25lOiAnMTd6J1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNldHRpbmdzS2V5TmFtZSwgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcbiAgICB9XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MoKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcblxuLypcbiAgKiBQdWJsaWMgU2V0dGluZ3NcbiAgKiBAZGVzYyA6IHRoaXMgYSBwdWJsaWMgdmVyc2lvbiBvZiB0aGUgc2V0dGluZ3MgZmlsZSBzaG93aW5nIGl0J3Mgc3RydWN0dXJlLFxuICAqICAgICAgICAgaXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQsIGFuZCBJIGNhbid0IHBvc3QgbWluZSBhcyBpdCBjb250YWluc1xuICAqICAgICAgICAgQVBJIGtleXMgYW5kIGNyZWRlbnRpYWxzISBSZW5hbWUgdGhpcyB0byBzZXR0aW5ncy5jb2ZmZWUgYW5kXG4gICogICAgICAgICBmaWxsIGluIHlvdXIgb3duIGluZm9ybWF0aW9uLlxuICAqIEBhdXRob3IgOiBUeWxlciBGb3dsZXIgPHR5bGVyZm93bGVyLjEzMzdAZ21haWwuY29tPlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIHNldFNldHRpbmdzLCBzZXR0aW5nc0tleU5hbWU7XG5cbiAgc2V0dGluZ3NLZXlOYW1lID0gJ3NldHRpbmdzJztcblxuICB3aW5kb3cucmVzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJldHVybiBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfTtcblxuICBzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXR0aW5ncztcbiAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHNldHRpbmdzS2V5TmFtZSkpIHtcbiAgICAgIHNldHRpbmdzID0ge1xuXG4gICAgICAgIC8qIERlc2lnbmVyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgZG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMCxcbiAgICAgICAgICBjbGllbnRfaWQ6ICc3MjM1YTVhNWE3ZDcyYTQ3ZjkyMWIxZTBlYjIxYjIxM2QyMDllMGQzNzYxYzZhM2JjZDNkMDE4ZDZkMzFkMjZmJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnODdiNGEwYTg4OTdmNGFjNmNkZDYxNWNkOThiNjVjYmJmMGViODBhYzk0OWJhZjNhNGYyODI2YTliMTYzMGNkNycsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiAndXJuOmlldGY6d2c6b2F1dGg6Mi4wOm9vYidcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBIYWNrZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBobjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogRm9yZWNhc3QuaW8gU2V0dGluZ3MgKi9cbiAgICAgICAgZm9yZWNhc3Rpbzoge1xuICAgICAgICAgIGFwaV9rZXk6ICczZWJjM2ZiNDI3YjhmOGM0OWE0MDQ0NmZmZTlmZWFjOCcsXG4gICAgICAgICAgZm9yZWNhc3RfcmVmcmVzaDogNjAgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgdG9uaWdodF9ob3VyOiAyMSxcbiAgICAgICAgICB0b21vcnJvd19ob3VyOiAxMixcbiAgICAgICAgICBjaXR5X25hbWU6ICdLQycsXG4gICAgICAgICAgbGF0aXR1ZGU6ICczOS4wNjI4MTY4JyxcbiAgICAgICAgICBsb25naXR1ZGU6ICctOTQuNTgwOTQ0OScsXG4gICAgICAgICAgdGltZXpvbmU6ICcxN3onXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2V0dGluZ3NLZXlOYW1lLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgIH1cbiAgfTtcblxuICBzZXRTZXR0aW5ncygpO1xuXG59KS5jYWxsKHRoaXMpO1xuIl19
