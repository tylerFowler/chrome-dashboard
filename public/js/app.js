(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock       = require('./components/clock');
var DNList      = require('./components/dn');
var HNList      = require('./components/hn');
var WeatherCard = require('./components/weather_card');
var Bookmark    = require('./components/bookmark');


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

},{"./components/bookmark":2,"./components/clock":3,"./components/dn":4,"./components/hn":5,"./components/weather_card":6,"react":"react"}],2:[function(require,module,exports){
var React = require('react');

var Bookmark = React.createClass({displayName: "Bookmark",
  render: function() {
    return (
      React.createElement("div", {className: "bookmark-card " + this.props.class}

      )
    );
  }
});

module.exports = Bookmark;

},{"react":"react"}],3:[function(require,module,exports){
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

},{"react":"react"}],4:[function(require,module,exports){
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

},{"../model/dn_store":7,"react":"react"}],5:[function(require,module,exports){
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

},{"../model/hn_store":9,"react":"react"}],6:[function(require,module,exports){
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

},{"../model/forecastio":8,"react":"react"}],7:[function(require,module,exports){
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

},{"jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var $, ForecastIO, forecastioSettings;

  $ = require('jquery');

  forecastioSettings = JSON.parse(localStorage.getItem('settings')).forecastio;

  ForecastIO = (function() {
    function ForecastIO(apiKey, forecastRefresh, location, tonightHour, tomorrowHour) {
      this.apiKey = apiKey;
      this.forecastRefresh = forecastRefresh;
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

  module.exports = new ForecastIO(forecastioSettings.api_key, forecastioSettings.forecast_refresh, {
    latitude: forecastioSettings.latitude,
    longitude: forecastioSettings.longitude
  }, forecastioSettings.tonight_hour, forecastioSettings.tomorrow_hour);

}).call(this);

},{"jquery":"jquery"}],9:[function(require,module,exports){
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

},{"jquery":"jquery","underscore":"underscore"}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Jvb2ttYXJrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jbG9jay5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvZG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2huLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy93ZWF0aGVyX2NhcmQuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2ZvcmVjYXN0aW8uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9obl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3B1YmxpY19zZXR0aW5ncy5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLy8gQ29tcG9uZW50c1xudmFyIENsb2NrICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nsb2NrJyk7XG52YXIgRE5MaXN0ICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZG4nKTtcbnZhciBITkxpc3QgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9obicpO1xudmFyIFdlYXRoZXJDYXJkID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3dlYXRoZXJfY2FyZCcpO1xudmFyIEJvb2ttYXJrICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Jvb2ttYXJrJyk7XG5cblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBcHBcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJsZWZ0LXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRE5MaXN0LCB7c2hvd1RvcDogZmFsc2UsIG1heFN0b3JpZXM6IDl9KVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2VudGVyLXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2xvY2ssIG51bGwpLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3aWRnZXQtY29udGFpbmVyXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJsZWZ0LXdpZGdldFwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2VhdGhlckNhcmQsIG51bGwpXG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJpZ2h0LXdpZGdldCBzdW5yaXNlLWNhcmRcIn1cbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJib29rbWFyay1jb250YWluZXJcIn1cblxuICAgICAgICAgIClcblxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicmlnaHQtcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChITkxpc3QsIHtzaG93VG9wOiBmYWxzZSwgbWF4U3RvcmllczogOX0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyKFxuICBSZWFjdC5jcmVhdGVFbGVtZW50KEFwcCwgbnVsbCksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jylcbik7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQm9va21hcmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQm9va21hcmtcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWNhcmQgXCIgKyB0aGlzLnByb3BzLmNsYXNzfVxuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9va21hcms7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgbW9udGhOYW1lcyA9IFsgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInIF07XG5cbnZhciBDbG9jayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDbG9ja1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHRpbWU6IHt9IH07XG4gIH0sXG5cbiAgdXBkYXRlVGltZURhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgdGltZU9iaiA9IHt9O1xuXG4gICAgLy8gaG91cnMgYXJlIGluIG1pbGl0YXJ5IHRpbWVcbiAgICBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID09PSAxMikge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnUE0nO1xuICAgIH0gZWxzZSBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID4gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSBjdXJEYXRlLmdldEhvdXJzKCkgLSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMCkge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH1cblxuXG4gICAgLy8gd2UgYWx3YXlzIHdhbnQgdGhlIHRpbWUgdG8gYmUgMiBkaWdpcyAoaS5lLiAwOSBpbnN0ZWFkIG9mIDkpXG4gICAgbWlucyA9IGN1ckRhdGUuZ2V0TWludXRlcygpO1xuICAgIHRpbWVPYmoubWludXRlcyA9IG1pbnMgPiA5ID8gJycgKyBtaW5zIDogJzAnICsgbWlucztcblxuICAgIHRpbWVPYmoubW9udGggPSBtb250aE5hbWVzW2N1ckRhdGUuZ2V0TW9udGgoKV07XG4gICAgdGltZU9iai5kYXkgPSBjdXJEYXRlLmdldERhdGUoKTtcbiAgICB0aW1lT2JqLnllYXIgPSBjdXJEYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdGltZTogdGltZU9iaiB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51cGRhdGVUaW1lRGF0YSgpO1xuICAgIHNldEludGVydmFsKHRoaXMudXBkYXRlVGltZURhdGEsIDEwMDApOyAvLyB1cGRhdGUgZXZlcnkgc2Vjb25kXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNsb2NrXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpbWVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCB7aWQ6IFwiY3VyLXRpbWVcIn0sIHRoaXMuc3RhdGUudGltZS5ob3VycywgXCI6XCIsIHRoaXMuc3RhdGUudGltZS5taW51dGVzKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1wZXJpb2RcIn0sIHRoaXMuc3RhdGUudGltZS5wZXJpb2QpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGl2aWRlclwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGF0ZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1kYXRlXCJ9LCB0aGlzLnN0YXRlLnRpbWUubW9udGgsIFwiIFwiLCB0aGlzLnN0YXRlLnRpbWUuZGF5LCBcIiwgXCIsIHRoaXMuc3RhdGUudGltZS55ZWFyKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvY2s7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGRuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvZG5fc3RvcmUnKTtcblxuRE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBkbkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkRG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBkbi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGRuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuZG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZERuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkRG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfSkuYmluZCh0aGlzKSwgZG4ucmVmcmVzaEludGVydmFsKTtcbiAgfSxcblxuICAvLyByZW5kZXJFcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgcmV0dXJuIChcbiAgLy9cbiAgLy8gICApXG4gIC8vIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBkbi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkbmxpc3QgPSB0aGlzLnN0YXRlLnN0b3JpZXMubWFwKGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkl0ZW0sIHtzdG9yeUlkOiBpbmRleCwgXG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLCBcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCwgXG4gICAgICAgICAgZG51cmw6IHN0b3J5LmRudXJsLCBcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS51cHZvdGVzLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoZG5saXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgIGxvYWRpbmcgPSB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICBlbHNlXG4gICAgICBsb2FkaW5nID0gJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgZG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGRuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiRGVzaWduZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBkbmxpc3RcIn0sIFxuICAgICAgICAgIGxvYWRpbmcsIFxuICAgICAgICAgIGRubGlzdFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBETkl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRE5JdGVtXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1JZCA9ICdkbml0ZW0tJyArIHRoaXMucHJvcHMuc3RvcnlJZDtcbiAgICB2YXIgY29tbWVudFRleHQgPSB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCA9PT0gMSA/ICdjb21tZW50JyA6ICdjb21tZW50cyc7XG5cbiAgICAvLyBUT0RPOiBtYWtlIGl0IHNheSAxIGNvbW1lbnQgaW5zdGVhZCBvZiAxIGNvbW1lbnRzXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pdGVtIGRuLWl0ZW1cIiwgaWQ6IGl0ZW1JZH0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pbmRleFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5wcm9wcy5zdG9yeUlkICsgMSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXRpdGxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIHRoaXMucHJvcHMudGl0bGUpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1tZXRhZGF0YVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS11cHZvdGVzXCJ9LCB0aGlzLnByb3BzLnVwdm90ZXMsIFwiIHVwdm90ZXNcIiksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1cHZvdGUtaWNvblwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS1hdXRob3JcIn0sIHRoaXMucHJvcHMuYXV0aG9yKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWRhdGEtZGl2aWRlclwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1jb21tZW50c1wiLCBocmVmOiB0aGlzLnByb3BzLmRudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCBcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudENvdW50LCBcIiBcIiwgY29tbWVudFRleHRcbiAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEROTGlzdDtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgaG4gICAgPSByZXF1aXJlKCcuLi9tb2RlbC9obl9zdG9yZScpO1xuXG5ITkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSE5MaXN0XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgc3RvcmllczogW10sIGVycjogbnVsbCB9O1xuICB9LFxuXG4gIGhuQ2I6IGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgIGlmIChlcnIpIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBbXSwgZXJyOiBlcnIgfSk7XG4gICAgZWxzZSB0aGlzLnNldFN0YXRlKHsgc3Rvcmllczogc3RvcmllcywgZXJyOiBudWxsIH0pO1xuICB9LFxuXG4gIGxvYWRIblN0b3JpZXM6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvd1RvcCA9PT0gdHJ1ZSlcbiAgICAgIGhuLmdldFRvcFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gICAgZWxzZVxuICAgICAgaG4uZ2V0UmVjZW50U3RvcmllcyhsaW1pdCwgdGhpcy5obkNiKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG5cbiAgICBzZXRJbnRlcnZhbCgoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxvYWRIblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcbiAgICB9KS5iaW5kKHRoaXMpLCBobi5yZWZyZXNoSW50ZXJ2YWwpO1xuICB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gaG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGhudXJsOiBzdG9yeS5obnVybCwgXG4gICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoaG5saXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgIGxvYWRpbmcgPSB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICBlbHNlXG4gICAgICBsb2FkaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGhuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBobi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkhhY2tlciBOZXdzXCIpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1saXN0IGhubGlzdFwifSwgXG4gICAgICAgICAgbG9hZGluZywgXG4gICAgICAgICAgaG5saXN0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEhOSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJITkl0ZW1cIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbUlkID0gJ2huaXRlbS0nICsgdGhpcy5wcm9wcy5zdG9yeUlkO1xuICAgIHZhciBjb21tZW50VGV4dCA9IHRoaXMucHJvcHMuY29tbWVudENvdW50ID09PSAxID8gJ2NvbW1lbnQnIDogJ2NvbW1lbnRzJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBobi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy5zY29yZSwgXCIgdXB2b3Rlc1wiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVwdm90ZS1pY29uXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWF1dGhvclwifSwgdGhpcy5wcm9wcy5hdXRob3IpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktZGF0YS1kaXZpZGVyXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWNvbW1lbnRzXCIsIGhyZWY6IHRoaXMucHJvcHMuaG51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21tZW50Q291bnQsIFwiIFwiLCBjb21tZW50VGV4dFxuICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSE5MaXN0O1xuIiwidmFyIFJlYWN0ICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGZvcmVjYXN0aW8gPSByZXF1aXJlKCcuLi9tb2RlbC9mb3JlY2FzdGlvJyk7XG5cbi8vIFRPRE86IHRoaXMgY29tcG9uZW50IHNob3VsZCBoYXZlIDIgcHJvcHM6XG4vLyAtIGNpdHlOYW1lIDogQ29sbG9xdWlhbCBuYW1lIGZvciB0aGUgY2l0eSAoaS5lLiAnS0MnKVxuLy8gLSBjaXR5IDogQWRkcmVzcyBvZiB0aGUgY2l0eSAoaS5lLiBLYW5zYXMgQ2l0eSwgTU8sIDY0MTExIFVTQSlcblxuV2VhdGhlckNhcmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiV2VhdGhlckNhcmRcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiBudWxsLFxuICAgICAgY2l0eTogdW5kZWZpbmVkLFxuXG4gICAgICBjdXJyZW50V2VhdGhlcjoge1xuICAgICAgICB0ZW1wOiAnMDAnLFxuICAgICAgICBjb25kaXRpb246IHVuZGVmaW5lZFxuICAgICAgfSxcblxuICAgICAgZnV0dXJlV2VhdGhlcjoge1xuICAgICAgICB0aW1lT2ZEYXk6ICdUb25pZ2h0JyxcbiAgICAgICAgdGVtcDogJzAwJyxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIC8vIEdldHMgdGhlIGZ1dHVyZSAndGVuc2UnIHRvIHVzZSBiYXNlZCBvbiB0aGUgY3VycmVudCB0aW1lOlxuICAvLyAgIDUgYW0gdG8gNiBwbSAtIFRvbmlnaHRcbiAgLy8gICA3cG0gdG8gNGFtIC0gVG9tb3Jyb3dcbiAgZ2V0RnV0dXJlVGVuc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJIb3VyID0gKG5ldyBEYXRlKCkpLmdldEhvdXJzKCk7XG4gICAgcmV0dXJuIChjdXJIb3VyID49IDUgJiYgY3VySG91ciA8PSAxOCkgPyAnVG9uaWdodCcgOiAnVG9tb3Jyb3cnO1xuICB9LFxuXG4gIGdldEZ1dHVyZVRpbWU6IGZ1bmN0aW9uKGZ1dHVyZVRlbnNlKSB7XG4gICAgdmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgaWYgKGZ1dHVyZVRlbnNlID09PSAnVG9uaWdodCcpIHtcbiAgICAgIGN1clRpbWUuc2V0SG91cnMoZm9yZWNhc3Rpby50b25pZ2h0SG91cik7XG4gICAgICByZXR1cm4gY3VyVGltZTtcbiAgICB9IGVsc2UgaWYgKGZ1dHVyZVRlbnNlID09PSAnVG9tb3Jyb3cnKSB7XG4gICAgICAvLyBzaW5jZSB3ZSB3YW50ICd0b21vcnJvdycgdG8gYmUgZXZlbiB0ZWNobmljYWxseSB0aGUgc2FtZSBkYXkgd2hlbiBpdCdzXG4gICAgICAvLyBiZXR3ZWVuIG1pZG5pZ2h0IGFuZCA0IGFtIHdlIG5lZWQgYSBiaXQgb2YgZXh0cmEgbG9naWNcbiAgICAgIGlmIChjdXJUaW1lLmdldEhvdXJzKCkgPj0gMTkpIC8vIGFyZSB3ZSBhdCBvciBhZnRlciA3cG0/XG4gICAgICAgIGN1clRpbWUuc2V0RGF0ZShjdXJUaW1lLmdldERhdGUoKSArIDEpOyAvLyBnZXQgdXMgdG8gdG9tb3Jyb3dcblxuICAgICAgY3VyVGltZS5zZXRIb3Vycyhmb3JlY2FzdGlvLnRvbW9ycm93SG91cik7XG4gICAgICByZXR1cm4gY3VyVGltZTtcbiAgICB9IGVsc2UgdGhpcy5zZXRTdGF0ZSh7ZXJyOiBuZXcgRXJyb3IoZnV0dXJlVGVuc2UgKyAnIGlzIG5vdCByZWNvZ25pemVkJyl9KTtcbiAgfSxcblxuICB1cGRhdGVGb3JlY2FzdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2l0eTogZm9yZWNhc3Rpby5jaXR5TmFtZX0pO1xuXG4gICAgLy8gdXBkYXRlIGN1cnJlbnQgdGVtcFxuICAgIGZvcmVjYXN0aW8uZ2V0Rm9yZWNhc3QobnVsbCwgZnVuY3Rpb24oZXJyLCBmb3JlY2FzdCkge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2VycjogZXJyfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50V2VhdGhlcjoge1xuICAgICAgICAgIHRlbXA6IGZvcmVjYXN0LnRlbXAudG9GaXhlZCgpLFxuICAgICAgICAgIGNvbmRpdGlvbjogZm9yZWNhc3QuY29uZGl0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBnZXQgdGhlIGZ1dHVyZSB0aW1lICYgZ2V0IGZvcmVjYXN0IGZvciBpdFxuICAgIHZhciBmdXR1cmVUZW5zZSA9IHRoaXMuZ2V0RnV0dXJlVGVuc2UoKTtcbiAgICB2YXIgZnV0dXJlVGltZSA9IHRoaXMuZ2V0RnV0dXJlVGltZShmdXR1cmVUZW5zZSk7XG5cbiAgICBmb3JlY2FzdGlvLmdldEZvcmVjYXN0KGZ1dHVyZVRpbWUsIGZ1bmN0aW9uKGVyciwgZm9yZWNhc3QpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnNldFN0YXRlKHtlcnI6IGVycn0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnV0dXJlV2VhdGhlcjoge1xuICAgICAgICAgIHRpbWVPZkRheTogZnV0dXJlVGVuc2UsXG4gICAgICAgICAgdGVtcDogZm9yZWNhc3QudGVtcC50b0ZpeGVkKCksXG4gICAgICAgICAgY29uZGl0aW9uOiBmb3JlY2FzdC5jb25kaXRpb25cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgLy8gcmVuZGVyIGdldHMgY2FsbGVkIGJlZm9yZSB0aGlzXG5cbiAgICB0aGlzLnVwZGF0ZUZvcmVjYXN0KCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItY2FyZFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaXR5XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLmNpdHkpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWN1cnJlbnRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb25kaXRpb24gXCIgKyB0aGlzLnN0YXRlLmN1cnJlbnRXZWF0aGVyLmNvbmRpdGlvbn1cbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0ZW1wXCJ9LCBcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFdlYXRoZXIudGVtcCwgXCLCsFwiXG4gICAgICAgICAgKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1mdXR1cmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwidGltZS1vZi1kYXkgXCIgK1xuICAgICAgICAgICAgKHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci50aW1lT2ZEYXkgPT09ICdUb25pZ2h0JyA/ICcnIDogJ3dpZGUnKX0sIFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGltZU9mRGF5LCBcIjpcIlxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRlbXBcIn0sIFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5mdXR1cmVXZWF0aGVyLnRlbXAsIFwiwrBcIlxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbmRpdGlvbiBcIiArIHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci5jb25kaXRpb259XG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhdGhlckNhcmQ7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBEZXNpZ25lck5ld3MsIGRuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgZG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmRuO1xuXG4gIERlc2lnbmVyTmV3cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBEZXNpZ25lck5ld3MoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgcmVkaXJlY3RVcmksIHJlZnJlc2hJbnRlcnZhbCkge1xuICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xuICAgICAgdGhpcy5jbGllbnRTZWNyZXQgPSBjbGllbnRTZWNyZXQ7XG4gICAgICB0aGlzLnJlZGlyZWN0VXJpID0gcmVkaXJlY3RVcmk7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuZG5VcmkgPSAnaHR0cHM6Ly9hcGktbmV3cy5sYXllcnZhdWx0LmNvbS9hcGkvdjEnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgdXB2b3RlcywgYXV0aG9yLCBjb21tZW50X2NvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRUb3BTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcz9jbGllbnRfaWQ9XCIgKyB0aGlzLmNsaWVudElkLCB7fSkuZG9uZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc1N0b3JpZXMoZGF0YS5zdG9yaWVzLnNsaWNlKDAsIGxpbWl0KSwgZnVuY3Rpb24oc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBEZXNpZ25lck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcy9yZWNlbnQ/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI3Byb2Nlc3NTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcHJvY2Vzc2VzIHJhdyBETiBzdG9yeSBkYXRhIGludG8gYSBzdHJpcHBlZCBkb3duIGFwaVxuICAgICAgKiBAcGFyYW0gOiBbIHsgc3RvcmllcyB9IF1cbiAgICAgICogQHBhcmFtIDogbGltaXRcbiAgICAgICogQGNhbGxzIDogY2IoW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5wcm9jZXNzU3RvcmllcyA9IGZ1bmN0aW9uKHN0b3JpZXMsIGNiKSB7XG4gICAgICB2YXIgcHJvY2Vzc2VkU3RvcmllcztcbiAgICAgIHByb2Nlc3NlZFN0b3JpZXMgPSBbXTtcbiAgICAgIHJldHVybiBfLmVhY2goc3RvcmllcywgZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICAgIHZhciBwcm9jZXNzZWQ7XG4gICAgICAgIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsXG4gICAgICAgICAgZG51cmw6IHN0b3J5LnNpdGVfdXJsLFxuICAgICAgICAgIHVwdm90ZXM6IHN0b3J5LnZvdGVfY291bnQsXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS51c2VyX2Rpc3BsYXlfbmFtZSxcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRzLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzZWRTdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSBzdG9yaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gY2IocHJvY2Vzc2VkU3Rvcmllcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVzaWduZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgRGVzaWduZXJOZXdzKGRuU2V0dGluZ3MuY2xpZW50X2lkLCBkblNldHRpbmdzLmNsaWVudF9zZWNyZXQsIGRuU2V0dGluZ3MucmVkaXJlY3RfdXJpLCBkblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRm9yZWNhc3RJTywgZm9yZWNhc3Rpb1NldHRpbmdzO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBmb3JlY2FzdGlvU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5mb3JlY2FzdGlvO1xuXG4gIEZvcmVjYXN0SU8gPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRm9yZWNhc3RJTyhhcGlLZXksIGZvcmVjYXN0UmVmcmVzaCwgbG9jYXRpb24sIHRvbmlnaHRIb3VyLCB0b21vcnJvd0hvdXIpIHtcbiAgICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgICAgdGhpcy5mb3JlY2FzdFJlZnJlc2ggPSBmb3JlY2FzdFJlZnJlc2g7XG4gICAgICB0aGlzLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICB0aGlzLnRvbmlnaHRIb3VyID0gdG9uaWdodEhvdXI7XG4gICAgICB0aGlzLnRvbW9ycm93SG91ciA9IHRvbW9ycm93SG91cjtcbiAgICAgIHRoaXMuZm9yZWNhc3Rpb1VyaSA9ICdodHRwczovL2FwaS5mb3JlY2FzdC5pby9mb3JlY2FzdCc7XG4gICAgICB0aGlzLmNpdHlOYW1lID0gZm9yZWNhc3Rpb1NldHRpbmdzLmNpdHlfbmFtZTtcbiAgICB9XG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5nZXRWYWxpZFRpbWVTdHJpbmcgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgICByZXR1cm4gdGltZS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLiguKikkLywgJycpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEZvcmVjYXN0SU8jZ2V0Rm9yZWNhc3RcbiAgICAgICogQGRlc2MgOiBlbnN1cmVzIHRoYXQgbG9jYXRpb24gaXMgc2V0LCB0aGVuIGNhbGxzIHJlcXVlc3RGb3JlY2FzdFxuICAgICAgKiBAcGFyYW0gOiB7dGltZX0gLSBEYXRlIG9iamVjdCwgZ2V0cyBjdXJyZW50IGlmIG51bGxcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCB7IHRlbXAsIFwiY29uZGl0aW9uXCIgfSlcbiAgICAgKi9cblxuICAgIEZvcmVjYXN0SU8ucHJvdG90eXBlLmdldEZvcmVjYXN0ID0gZnVuY3Rpb24odGltZSwgY2IpIHtcbiAgICAgIHZhciBxdWVyeVN0cmluZztcbiAgICAgIHF1ZXJ5U3RyaW5nID0gXCJcIiArIHRoaXMubG9jYXRpb24ubGF0aXR1ZGUgKyBcIixcIiArIHRoaXMubG9jYXRpb24ubG9uZ2l0dWRlO1xuICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gXCIsXCIgKyAodGhpcy5nZXRWYWxpZFRpbWVTdHJpbmcodGltZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5mb3JlY2FzdGlvVXJpICsgXCIvXCIgKyB0aGlzLmFwaUtleSArIFwiL1wiICsgcXVlcnlTdHJpbmcgKyBcIj9jYWxsYmFjaz0/XCIsIHt9KS5kb25lKGZ1bmN0aW9uKGZvcmVjYXN0RGF0YSkge1xuICAgICAgICB2YXIgZm9yZWNhc3Q7XG4gICAgICAgIGZvcmVjYXN0ID0ge1xuICAgICAgICAgIHRlbXA6IGZvcmVjYXN0RGF0YS5jdXJyZW50bHkuYXBwYXJlbnRUZW1wZXJhdHVyZSxcbiAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0RGF0YS5jdXJyZW50bHkuaWNvblxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY2IobnVsbCwgZm9yZWNhc3QpO1xuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBGb3JlY2FzdElPO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgRm9yZWNhc3RJTyhmb3JlY2FzdGlvU2V0dGluZ3MuYXBpX2tleSwgZm9yZWNhc3Rpb1NldHRpbmdzLmZvcmVjYXN0X3JlZnJlc2gsIHtcbiAgICBsYXRpdHVkZTogZm9yZWNhc3Rpb1NldHRpbmdzLmxhdGl0dWRlLFxuICAgIGxvbmdpdHVkZTogZm9yZWNhc3Rpb1NldHRpbmdzLmxvbmdpdHVkZVxuICB9LCBmb3JlY2FzdGlvU2V0dGluZ3MudG9uaWdodF9ob3VyLCBmb3JlY2FzdGlvU2V0dGluZ3MudG9tb3Jyb3dfaG91cik7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBIYWNrZXJOZXdzLCBoblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGhuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5objtcblxuICBIYWNrZXJOZXdzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEhhY2tlck5ld3MocmVmcmVzaEludGVydmFsKSB7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuaG5VcmkgPSAnaHR0cHM6Ly9oYWNrZXItbmV3cy5maXJlYmFzZWlvLmNvbS92MCc7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gSGFja2VyIE5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIClcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFRvcFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IpIHtcbiAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIHRoaXMuaG5VcmkgKyBcIi90b3BzdG9yaWVzLmpzb25cIiwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgIHN0b3J5SWRzID0gZGF0YS5zbGljZSgwLCBsaW1pdCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gaGFja2VyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHNjb3JlLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFJlY2VudFN0b3JpZXMgPSBmdW5jdGlvbihsaW1pdCwgY2IpIHtcbiAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIHRoaXMuaG5VcmkgKyBcIi9uZXdzdG9yaWVzLmpzb25cIiwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgdmFyIHN0b3J5SWRzO1xuICAgICAgICAgIHN0b3J5SWRzID0gZGF0YS5zbGljZSgwLCBsaW1pdCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0b3JpZXMoc3RvcnlJZHMsIGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IGdldHMgdGhlIHN0b3J5IGNvbnRlbnQgZm9yIGdpdmVuIHN0b3J5IGlkc1xuICAgICAgKiBAcGFyYW0gOiBbaWRzXVxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHNjb3JlLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldFN0b3JpZXMgPSBmdW5jdGlvbihpZHMsIGNiKSB7XG4gICAgICB2YXIgYWpheEVyciwgc3RvcmllcztcbiAgICAgIHN0b3JpZXMgPSBbXTtcbiAgICAgIGFqYXhFcnIgPSBudWxsO1xuICAgICAgcmV0dXJuIF8uZWFjaChpZHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaWQsIGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgX3RoaXMuaG5VcmkgKyBcIi9pdGVtL1wiICsgaWQgKyBcIi5qc29uXCIsIHt9KS5kb25lKGZ1bmN0aW9uKHN0b3J5KSB7XG4gICAgICAgICAgICB2YXIgaG51cmwsIHByb2Nlc3NlZDtcbiAgICAgICAgICAgIGhudXJsID0gX3RoaXMuZ2V0SE5TdG9yeVVybChzdG9yeS5pZCk7XG4gICAgICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSxcbiAgICAgICAgICAgICAgdXJsOiBzdG9yeS51cmwgPyBzdG9yeS51cmwgOiBobnVybCxcbiAgICAgICAgICAgICAgaG51cmw6IGhudXJsLFxuICAgICAgICAgICAgICBzY29yZTogc3Rvcnkuc2NvcmUsXG4gICAgICAgICAgICAgIGF1dGhvcjogc3RvcnkuYnksXG4gICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogc3Rvcnkua2lkcyA/IHN0b3J5LmtpZHMubGVuZ3RoIDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN0b3JpZXMucHVzaChwcm9jZXNzZWQpO1xuICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSBpZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRITlN0b3J5VXJsID0gZnVuY3Rpb24oc3RvcnlJZCkge1xuICAgICAgcmV0dXJuIFwiaHR0cHM6Ly9uZXdzLnljb21iaW5hdG9yLmNvbS9pdGVtP2lkPVwiICsgc3RvcnlJZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEhhY2tlck5ld3M7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IG5ldyBIYWNrZXJOZXdzKGhuU2V0dGluZ3MucmVmcmVzaF9pbnRlcnZhbF9tcyk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG5cbi8qXG4gICogUHVibGljIFNldHRpbmdzXG4gICogQGRlc2MgOiB0aGlzIGEgcHVibGljIHZlcnNpb24gb2YgdGhlIHNldHRpbmdzIGZpbGUgc2hvd2luZyBpdCdzIHN0cnVjdHVyZSxcbiAgKiAgICAgICAgIGl0IGlzIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkLCBhbmQgSSBjYW4ndCBwb3N0IG1pbmUgYXMgaXQgY29udGFpbnNcbiAgKiAgICAgICAgIEFQSSBrZXlzIGFuZCBjcmVkZW50aWFscyEgUmVuYW1lIHRoaXMgdG8gc2V0dGluZ3MuY29mZmVlIGFuZFxuICAqICAgICAgICAgZmlsbCBpbiB5b3VyIG93biBpbmZvcm1hdGlvbi5cbiAgKiBAYXV0aG9yIDogVHlsZXIgRm93bGVyIDx0eWxlcmZvd2xlci4xMzM3QGdtYWlsLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBzZXRTZXR0aW5ncywgc2V0dGluZ3NLZXlOYW1lO1xuXG4gIHNldHRpbmdzS2V5TmFtZSA9ICdzZXR0aW5ncyc7XG5cbiAgd2luZG93LnJlc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICByZXR1cm4gbG9jYXRpb24ucmVsb2FkKCk7XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0dGluZ3M7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzZXR0aW5nc0tleU5hbWUpKSB7XG4gICAgICBzZXR0aW5ncyA9IHtcblxuICAgICAgICAvKiBEZXNpZ25lciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGRuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgY2xpZW50X2lkOiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICc8aW5zZXJ0IHlvdXJzPicsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiAnPGluc2VydCB5b3Vycz4nXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogSGFja2VyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgaG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEZvcmVjYXN0LmlvIFNldHRpbmdzICovXG4gICAgICAgIGZvcmVjYXN0aW86IHtcbiAgICAgICAgICBhcGlfa2V5OiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIGZvcmVjYXN0X3JlZnJlc2g6IDYwICogNjAgKiAxMDAwLFxuICAgICAgICAgIHRvbmlnaHRfaG91cjogMjEsXG4gICAgICAgICAgdG9tb3Jyb3dfaG91cjogMTIsXG4gICAgICAgICAgY2l0eV9uYW1lOiAnS0MnLFxuICAgICAgICAgIGxhdGl0dWRlOiAnMzkuMDYyODE2OCcsXG4gICAgICAgICAgbG9uZ2l0dWRlOiAnLTk0LjU4MDk0NDknLFxuICAgICAgICAgIHRpbWV6b25lOiAnMTd6J1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNldHRpbmdzS2V5TmFtZSwgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcbiAgICB9XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MoKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcblxuLypcbiAgKiBQdWJsaWMgU2V0dGluZ3NcbiAgKiBAZGVzYyA6IHRoaXMgYSBwdWJsaWMgdmVyc2lvbiBvZiB0aGUgc2V0dGluZ3MgZmlsZSBzaG93aW5nIGl0J3Mgc3RydWN0dXJlLFxuICAqICAgICAgICAgaXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQsIGFuZCBJIGNhbid0IHBvc3QgbWluZSBhcyBpdCBjb250YWluc1xuICAqICAgICAgICAgQVBJIGtleXMgYW5kIGNyZWRlbnRpYWxzISBSZW5hbWUgdGhpcyB0byBzZXR0aW5ncy5jb2ZmZWUgYW5kXG4gICogICAgICAgICBmaWxsIGluIHlvdXIgb3duIGluZm9ybWF0aW9uLlxuICAqIEBhdXRob3IgOiBUeWxlciBGb3dsZXIgPHR5bGVyZm93bGVyLjEzMzdAZ21haWwuY29tPlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIHNldFNldHRpbmdzLCBzZXR0aW5nc0tleU5hbWU7XG5cbiAgc2V0dGluZ3NLZXlOYW1lID0gJ3NldHRpbmdzJztcblxuICB3aW5kb3cucmVzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJldHVybiBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfTtcblxuICBzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXR0aW5ncztcbiAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHNldHRpbmdzS2V5TmFtZSkpIHtcbiAgICAgIHNldHRpbmdzID0ge1xuXG4gICAgICAgIC8qIERlc2lnbmVyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgZG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMCxcbiAgICAgICAgICBjbGllbnRfaWQ6ICc3MjM1YTVhNWE3ZDcyYTQ3ZjkyMWIxZTBlYjIxYjIxM2QyMDllMGQzNzYxYzZhM2JjZDNkMDE4ZDZkMzFkMjZmJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnODdiNGEwYTg4OTdmNGFjNmNkZDYxNWNkOThiNjVjYmJmMGViODBhYzk0OWJhZjNhNGYyODI2YTliMTYzMGNkNycsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiAndXJuOmlldGY6d2c6b2F1dGg6Mi4wOm9vYidcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBIYWNrZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBobjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogRm9yZWNhc3QuaW8gU2V0dGluZ3MgKi9cbiAgICAgICAgZm9yZWNhc3Rpbzoge1xuICAgICAgICAgIGFwaV9rZXk6ICczZWJjM2ZiNDI3YjhmOGM0OWE0MDQ0NmZmZTlmZWFjOCcsXG4gICAgICAgICAgZm9yZWNhc3RfcmVmcmVzaDogNjAgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgdG9uaWdodF9ob3VyOiAyMSxcbiAgICAgICAgICB0b21vcnJvd19ob3VyOiAxMixcbiAgICAgICAgICBjaXR5X25hbWU6ICdLQycsXG4gICAgICAgICAgbGF0aXR1ZGU6ICczOS4wNjI4MTY4JyxcbiAgICAgICAgICBsb25naXR1ZGU6ICctOTQuNTgwOTQ0OScsXG4gICAgICAgICAgdGltZXpvbmU6ICcxN3onXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2V0dGluZ3NLZXlOYW1lLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgIH1cbiAgfTtcblxuICBzZXRTZXR0aW5ncygpO1xuXG59KS5jYWxsKHRoaXMpO1xuIl19
