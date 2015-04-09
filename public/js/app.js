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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Jvb2ttYXJrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jYWxlbmRhcl9jYXJkLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9jbG9jay5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvZG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2huLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy93ZWF0aGVyX2NhcmQuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2ZvcmVjYXN0aW8uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9obl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3B1YmxpY19zZXR0aW5ncy5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLy8gQ29tcG9uZW50c1xudmFyIENsb2NrICAgICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2xvY2snKTtcbnZhciBETkxpc3QgICAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RuJyk7XG52YXIgSE5MaXN0ICAgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9obicpO1xudmFyIFdlYXRoZXJDYXJkICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvd2VhdGhlcl9jYXJkJyk7XG52YXIgQm9va21hcmtMaXN0ICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9ib29rbWFyaycpO1xuXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXBwXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEROTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNlbnRlci1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENsb2NrLCBudWxsKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2lkZ2V0LWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGVmdC13aWRnZXRcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlYXRoZXJDYXJkLCBudWxsKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFya0xpc3QsIG51bGwpXG5cbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJpZ2h0LXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5MaXN0LCB7c2hvd1RvcDogZmFsc2UsIG1heFN0b3JpZXM6IDl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciAkICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgQm9va21hcmtMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJvb2ttYXJrTGlzdFwiLFxuICAvLyB0aGlzIGNsYXNzIGRvZXNuJ3QgYWN0dWFsbHkgZG8gYW55dGhpbmcsIGl0J3MganVzdCBhIHdyYXBwZXIgdG8gc2ltcGxpZnlcbiAgLy8gdGhlIG1haW4gdmlldyBtYXJrdXBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWNvbnRhaW5lclwifSwgXG4gICAgICAgIC8qIE5vdGUgdGhhdCB0aGUgYm9va21hcmtzIGFyZSBsYWlkIG91dCBieSBpZCBudW1iZXIgKi8gXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstMVwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1mbGlwYm9hcmRcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwczovL2ZsaXBib2FyZC5jb20vXCJ9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb29rbWFyaywge2Jvb2ttYXJrSWQ6IFwiYm9va21hcmstMlwiLCBjdXN0b21DbGFzczogXCJib29rbWFyay1zaW1wbGVcIiwgXG4gICAgICAgICAgbGluazogXCJodHRwczovL2Jhbmsuc2ltcGxlLmNvbS9cIn0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJvb2ttYXJrLCB7Ym9va21hcmtJZDogXCJib29rbWFyay0zXCIsIGN1c3RvbUNsYXNzOiBcImJvb2ttYXJrLW5ld3lvcmtlclwiLCBcbiAgICAgICAgICBsaW5rOiBcImh0dHA6Ly93d3cubmV3eW9ya2VyLmNvbS9cIn0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJvb2ttYXJrLCB7Ym9va21hcmtJZDogXCJib29rbWFyay00XCIsIGN1c3RvbUNsYXNzOiBcImJvb2ttYXJrLXF6XCIsIFxuICAgICAgICAgIGxpbms6IFwiaHR0cDovL3F6LmNvbS9cIn0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBCb29rbWFyayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJCb29rbWFya1wiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIGlkOiB0aGlzLnByb3BzLmJvb2ttYXJrSWQsIFxuICAgICAgICBjbGFzc05hbWU6IFwiYm9va21hcmstY2FyZCBcIiArIHRoaXMucHJvcHMuY3VzdG9tQ2xhc3N9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYm9va21hcmstbG9nb1wifSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb29rbWFya0xpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5DYWxlbmRhckNhcmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2FsZW5kYXJDYXJkXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjogbnVsbCxcblxuICAgICAgY2FsZW5kYXJMaXN0OiBbXSxcbiAgICB9O1xuICB9LFxuXG4gIGZpbGxNb2NrdXBEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNhbGVuZGFyTGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1BlcnNvbmFsJyxcbiAgICAgICAgICB1cGNvbWluZ0V2ZW50czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aXRsZTogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgdGltZTogJzEyOjMwJyxcbiAgICAgICAgICAgICAgZGF0ZTogJzQtOC0yMDE1IDAwOjAwOjAwLTA1MDBHTVQnIC8vIHRoaXMgc2hvdWxkIGJlIGEgZGF0ZSBvYmplY3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsIFwiTm90IGZpbmlzaGVkIVwiKSApO1xuICB9XG59KTtcblxubW9kdWxlcy5leHBvcnQgPSBDYWxlbmRhckNhcmQ7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgbW9udGhOYW1lcyA9IFsgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInIF07XG5cbnZhciBDbG9jayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDbG9ja1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHRpbWU6IHt9IH07XG4gIH0sXG5cbiAgdXBkYXRlVGltZURhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJEYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgdGltZU9iaiA9IHt9O1xuXG4gICAgLy8gaG91cnMgYXJlIGluIG1pbGl0YXJ5IHRpbWVcbiAgICBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID09PSAxMikge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnUE0nO1xuICAgIH0gZWxzZSBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID4gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSBjdXJEYXRlLmdldEhvdXJzKCkgLSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMCkge1xuICAgICAgdGltZU9iai5ob3VycyA9IDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnQU0nO1xuICAgIH1cblxuXG4gICAgLy8gd2UgYWx3YXlzIHdhbnQgdGhlIHRpbWUgdG8gYmUgMiBkaWdpcyAoaS5lLiAwOSBpbnN0ZWFkIG9mIDkpXG4gICAgbWlucyA9IGN1ckRhdGUuZ2V0TWludXRlcygpO1xuICAgIHRpbWVPYmoubWludXRlcyA9IG1pbnMgPiA5ID8gJycgKyBtaW5zIDogJzAnICsgbWlucztcblxuICAgIHRpbWVPYmoubW9udGggPSBtb250aE5hbWVzW2N1ckRhdGUuZ2V0TW9udGgoKV07XG4gICAgdGltZU9iai5kYXkgPSBjdXJEYXRlLmdldERhdGUoKTtcbiAgICB0aW1lT2JqLnllYXIgPSBjdXJEYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdGltZTogdGltZU9iaiB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51cGRhdGVUaW1lRGF0YSgpO1xuICAgIHNldEludGVydmFsKHRoaXMudXBkYXRlVGltZURhdGEsIDEwMDApOyAvLyB1cGRhdGUgZXZlcnkgc2Vjb25kXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNsb2NrXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpbWVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCB7aWQ6IFwiY3VyLXRpbWVcIn0sIHRoaXMuc3RhdGUudGltZS5ob3VycywgXCI6XCIsIHRoaXMuc3RhdGUudGltZS5taW51dGVzKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1wZXJpb2RcIn0sIHRoaXMuc3RhdGUudGltZS5wZXJpb2QpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGl2aWRlclwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGF0ZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcImN1ci1kYXRlXCJ9LCB0aGlzLnN0YXRlLnRpbWUubW9udGgsIFwiIFwiLCB0aGlzLnN0YXRlLnRpbWUuZGF5LCBcIiwgXCIsIHRoaXMuc3RhdGUudGltZS55ZWFyKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvY2s7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGRuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvZG5fc3RvcmUnKTtcblxuRE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBkbkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkRG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBkbi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGRuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuZG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZERuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcbiAgICB9LmJpbmQodGhpcyksIGRuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgLy8gcmVuZGVyRXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAvLyAgIHJldHVybiAoXG4gIC8vXG4gIC8vICAgKVxuICAvLyB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gZG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5kbnVybCwgXG4gICAgICAgICAgdXB2b3Rlczogc3RvcnkudXB2b3RlcywgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKGRubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGRuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBkbi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkRlc2lnbmVyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgZG5saXN0XCJ9LCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBkbmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgRE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnZG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgLy8gVE9ETzogbWFrZSBpdCBzYXkgMSBjb21tZW50IGluc3RlYWQgb2YgMSBjb21tZW50c1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBkbi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy51cHZvdGVzLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5kbnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBETkxpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGhuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvaG5fc3RvcmUnKTtcblxuSE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBobkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkSG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBobi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGhuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgfSkuYmluZCh0aGlzKSwgaG4ucmVmcmVzaEludGVydmFsKTtcbiAgfSxcblxuICByZW5kZXJMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZlZWQtbG9hZGluZy1hbmltIGhuLWxvYWRpbmdcIn1cbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhubGlzdCA9IHRoaXMuc3RhdGUuc3Rvcmllcy5tYXAoZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOSXRlbSwge3N0b3J5SWQ6IGluZGV4LCBcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsIFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLCBcbiAgICAgICAgICBobnVybDogc3RvcnkuaG51cmwsIFxuICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSwgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKGhubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZSBobi1jb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicGFuZS1oZWFkZXIgaG4taGVhZGVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwgbnVsbCwgXCJIYWNrZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBobmxpc3RcIn0sIFxuICAgICAgICAgIGxvYWRpbmcsIFxuICAgICAgICAgIGhubGlzdFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBITkl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSE5JdGVtXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1JZCA9ICdobml0ZW0tJyArIHRoaXMucHJvcHMuc3RvcnlJZDtcbiAgICB2YXIgY29tbWVudFRleHQgPSB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCA9PT0gMSA/ICdjb21tZW50JyA6ICdjb21tZW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWl0ZW0gaG4taXRlbVwiLCBpZDogaXRlbUlkfSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWluZGV4XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCB0aGlzLnByb3BzLnN0b3J5SWQgKyAxKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktdGl0bGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB0aGlzLnByb3BzLnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgdGhpcy5wcm9wcy50aXRsZSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LW1ldGFkYXRhXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXVwdm90ZXNcIn0sIHRoaXMucHJvcHMuc2NvcmUsIFwiIHVwdm90ZXNcIiksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1cHZvdGUtaWNvblwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS1hdXRob3JcIn0sIHRoaXMucHJvcHMuYXV0aG9yKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWRhdGEtZGl2aWRlclwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1jb21tZW50c1wiLCBocmVmOiB0aGlzLnByb3BzLmhudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCBcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudENvdW50LCBcIiBcIiwgY29tbWVudFRleHRcbiAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhOTGlzdDtcbiIsInZhciBSZWFjdCAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBmb3JlY2FzdGlvID0gcmVxdWlyZSgnLi4vbW9kZWwvZm9yZWNhc3RpbycpO1xuXG4vLyBUT0RPOiB0aGlzIGNvbXBvbmVudCBzaG91bGQgaGF2ZSAyIHByb3BzOlxuLy8gLSBjaXR5TmFtZSA6IENvbGxvcXVpYWwgbmFtZSBmb3IgdGhlIGNpdHkgKGkuZS4gJ0tDJylcbi8vIC0gY2l0eSA6IEFkZHJlc3Mgb2YgdGhlIGNpdHkgKGkuZS4gS2Fuc2FzIENpdHksIE1PLCA2NDExMSBVU0EpXG5cbldlYXRoZXJDYXJkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIldlYXRoZXJDYXJkXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjogbnVsbCxcbiAgICAgIGNpdHk6IHVuZGVmaW5lZCxcblxuICAgICAgY3VycmVudFdlYXRoZXI6IHtcbiAgICAgICAgdGVtcDogJzAwJyxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH0sXG5cbiAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgdGltZU9mRGF5OiAnVG9uaWdodCcsXG4gICAgICAgIHRlbXA6ICcwMCcsXG4gICAgICAgIGNvbmRpdGlvbjogdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICAvLyBHZXRzIHRoZSBmdXR1cmUgJ3RlbnNlJyB0byB1c2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGltZTpcbiAgLy8gICA1IGFtIHRvIDYgcG0gLSBUb25pZ2h0XG4gIC8vICAgN3BtIHRvIDRhbSAtIFRvbW9ycm93XG4gIGdldEZ1dHVyZVRlbnNlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VySG91ciA9IChuZXcgRGF0ZSgpKS5nZXRIb3VycygpO1xuICAgIHJldHVybiAoY3VySG91ciA+PSA1ICYmIGN1ckhvdXIgPD0gMTgpID8gJ1RvbmlnaHQnIDogJ1RvbW9ycm93JztcbiAgfSxcblxuICBnZXRGdXR1cmVUaW1lOiBmdW5jdGlvbihmdXR1cmVUZW5zZSkge1xuICAgIHZhciBjdXJUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGlmIChmdXR1cmVUZW5zZSA9PT0gJ1RvbmlnaHQnKSB7XG4gICAgICBjdXJUaW1lLnNldEhvdXJzKGZvcmVjYXN0aW8udG9uaWdodEhvdXIpO1xuICAgICAgcmV0dXJuIGN1clRpbWU7XG4gICAgfSBlbHNlIGlmIChmdXR1cmVUZW5zZSA9PT0gJ1RvbW9ycm93Jykge1xuICAgICAgLy8gc2luY2Ugd2Ugd2FudCAndG9tb3Jyb3cnIHRvIGJlIGV2ZW4gdGVjaG5pY2FsbHkgdGhlIHNhbWUgZGF5IHdoZW4gaXQnc1xuICAgICAgLy8gYmV0d2VlbiBtaWRuaWdodCBhbmQgNCBhbSB3ZSBuZWVkIGEgYml0IG9mIGV4dHJhIGxvZ2ljXG4gICAgICBpZiAoY3VyVGltZS5nZXRIb3VycygpID49IDE5KSAvLyBhcmUgd2UgYXQgb3IgYWZ0ZXIgN3BtP1xuICAgICAgICBjdXJUaW1lLnNldERhdGUoY3VyVGltZS5nZXREYXRlKCkgKyAxKTsgLy8gZ2V0IHVzIHRvIHRvbW9ycm93XG5cbiAgICAgIGN1clRpbWUuc2V0SG91cnMoZm9yZWNhc3Rpby50b21vcnJvd0hvdXIpO1xuICAgICAgcmV0dXJuIGN1clRpbWU7XG4gICAgfSBlbHNlIHRoaXMuc2V0U3RhdGUoe2VycjogbmV3IEVycm9yKGZ1dHVyZVRlbnNlICsgJyBpcyBub3QgcmVjb2duaXplZCcpfSk7XG4gIH0sXG5cbiAgdXBkYXRlRm9yZWNhc3Q6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NpdHk6IGZvcmVjYXN0aW8uY2l0eU5hbWV9KTtcblxuICAgIC8vIHVwZGF0ZSBjdXJyZW50IHRlbXBcbiAgICBmb3JlY2FzdGlvLmdldEZvcmVjYXN0KG51bGwsIGZ1bmN0aW9uKGVyciwgZm9yZWNhc3QpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnNldFN0YXRlKHtlcnI6IGVycn0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFdlYXRoZXI6IHtcbiAgICAgICAgICB0ZW1wOiBmb3JlY2FzdC50ZW1wLnRvRml4ZWQoKSxcbiAgICAgICAgICBjb25kaXRpb246IGZvcmVjYXN0LmNvbmRpdGlvblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gZ2V0IHRoZSBmdXR1cmUgdGltZSAmIGdldCBmb3JlY2FzdCBmb3IgaXRcbiAgICB2YXIgZnV0dXJlVGVuc2UgPSB0aGlzLmdldEZ1dHVyZVRlbnNlKCk7XG4gICAgdmFyIGZ1dHVyZVRpbWUgPSB0aGlzLmdldEZ1dHVyZVRpbWUoZnV0dXJlVGVuc2UpO1xuXG4gICAgZm9yZWNhc3Rpby5nZXRGb3JlY2FzdChmdXR1cmVUaW1lLCBmdW5jdGlvbihlcnIsIGZvcmVjYXN0KSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7ZXJyOiBlcnJ9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgICB0aW1lT2ZEYXk6IGZ1dHVyZVRlbnNlLFxuICAgICAgICAgIHRlbXA6IGZvcmVjYXN0LnRlbXAudG9GaXhlZCgpLFxuICAgICAgICAgIGNvbmRpdGlvbjogZm9yZWNhc3QuY29uZGl0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlRm9yZWNhc3QoKTtcblxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy51cGRhdGVGb3JlY2FzdCgpO1xuICAgIH0uYmluZCh0aGlzKSwgZm9yZWNhc3Rpby5yZWZyZXNoKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1jYXJkXCJ9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2l0eS1jb250YWluZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaXR5XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMuc3RhdGUuY2l0eSlcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjdXJyZW50LWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndlYXRoZXItY3VycmVudFwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29uZGl0aW9uIFwiICsgdGhpcy5zdGF0ZS5jdXJyZW50V2VhdGhlci5jb25kaXRpb259XG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRlbXBcIn0sIFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRXZWF0aGVyLnRlbXAsIFwiwrBcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZ1dHVyZS1jb250YWluZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ3ZWF0aGVyLWZ1dHVyZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInRpbWUtb2YtZGF5IFwiICtcbiAgICAgICAgICAgICAgKHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci50aW1lT2ZEYXkgPT09ICdUb25pZ2h0JyA/ICcnIDogJ3dpZGUnKX0sIFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci50aW1lT2ZEYXksIFwiOlwiXG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRlbXBcIn0sIFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmZ1dHVyZVdlYXRoZXIudGVtcCwgXCLCsFwiXG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbmRpdGlvbiBcIiArIHRoaXMuc3RhdGUuZnV0dXJlV2VhdGhlci5jb25kaXRpb259XG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhdGhlckNhcmQ7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBEZXNpZ25lck5ld3MsIGRuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgZG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmRuO1xuXG4gIERlc2lnbmVyTmV3cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBEZXNpZ25lck5ld3MoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgcmVkaXJlY3RVcmksIHJlZnJlc2hJbnRlcnZhbCkge1xuICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xuICAgICAgdGhpcy5jbGllbnRTZWNyZXQgPSBjbGllbnRTZWNyZXQ7XG4gICAgICB0aGlzLnJlZGlyZWN0VXJpID0gcmVkaXJlY3RVcmk7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuZG5VcmkgPSAnaHR0cHM6Ly9hcGktbmV3cy5sYXllcnZhdWx0LmNvbS9hcGkvdjEnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgdXB2b3RlcywgYXV0aG9yLCBjb21tZW50X2NvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRUb3BTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcz9jbGllbnRfaWQ9XCIgKyB0aGlzLmNsaWVudElkLCB7fSkuZG9uZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc1N0b3JpZXMoZGF0YS5zdG9yaWVzLnNsaWNlKDAsIGxpbWl0KSwgZnVuY3Rpb24oc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBEZXNpZ25lck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcy9yZWNlbnQ/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI3Byb2Nlc3NTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcHJvY2Vzc2VzIHJhdyBETiBzdG9yeSBkYXRhIGludG8gYSBzdHJpcHBlZCBkb3duIGFwaVxuICAgICAgKiBAcGFyYW0gOiBbIHsgc3RvcmllcyB9IF1cbiAgICAgICogQHBhcmFtIDogbGltaXRcbiAgICAgICogQGNhbGxzIDogY2IoW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5wcm9jZXNzU3RvcmllcyA9IGZ1bmN0aW9uKHN0b3JpZXMsIGNiKSB7XG4gICAgICB2YXIgcHJvY2Vzc2VkU3RvcmllcztcbiAgICAgIHByb2Nlc3NlZFN0b3JpZXMgPSBbXTtcbiAgICAgIHJldHVybiBfLmVhY2goc3RvcmllcywgZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICAgIHZhciBwcm9jZXNzZWQ7XG4gICAgICAgIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsXG4gICAgICAgICAgZG51cmw6IHN0b3J5LnNpdGVfdXJsLFxuICAgICAgICAgIHVwdm90ZXM6IHN0b3J5LnZvdGVfY291bnQsXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS51c2VyX2Rpc3BsYXlfbmFtZSxcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRzLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzZWRTdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSBzdG9yaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gY2IocHJvY2Vzc2VkU3Rvcmllcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVzaWduZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgRGVzaWduZXJOZXdzKGRuU2V0dGluZ3MuY2xpZW50X2lkLCBkblNldHRpbmdzLmNsaWVudF9zZWNyZXQsIGRuU2V0dGluZ3MucmVkaXJlY3RfdXJpLCBkblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRm9yZWNhc3RJTywgZm9yZWNhc3Rpb1NldHRpbmdzO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBmb3JlY2FzdGlvU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5mb3JlY2FzdGlvO1xuXG4gIEZvcmVjYXN0SU8gPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRm9yZWNhc3RJTyhhcGlLZXksIHJlZnJlc2gsIGxvY2F0aW9uLCB0b25pZ2h0SG91ciwgdG9tb3Jyb3dIb3VyKSB7XG4gICAgICB0aGlzLmFwaUtleSA9IGFwaUtleTtcbiAgICAgIHRoaXMucmVmcmVzaCA9IHJlZnJlc2g7XG4gICAgICB0aGlzLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICB0aGlzLnRvbmlnaHRIb3VyID0gdG9uaWdodEhvdXI7XG4gICAgICB0aGlzLnRvbW9ycm93SG91ciA9IHRvbW9ycm93SG91cjtcbiAgICAgIHRoaXMuZm9yZWNhc3Rpb1VyaSA9ICdodHRwczovL2FwaS5mb3JlY2FzdC5pby9mb3JlY2FzdCc7XG4gICAgICB0aGlzLmNpdHlOYW1lID0gZm9yZWNhc3Rpb1NldHRpbmdzLmNpdHlfbmFtZTtcbiAgICB9XG5cbiAgICBGb3JlY2FzdElPLnByb3RvdHlwZS5nZXRWYWxpZFRpbWVTdHJpbmcgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgICByZXR1cm4gdGltZS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLiguKikkLywgJycpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIEZvcmVjYXN0SU8jZ2V0Rm9yZWNhc3RcbiAgICAgICogQGRlc2MgOiBlbnN1cmVzIHRoYXQgbG9jYXRpb24gaXMgc2V0LCB0aGVuIGNhbGxzIHJlcXVlc3RGb3JlY2FzdFxuICAgICAgKiBAcGFyYW0gOiB7dGltZX0gLSBEYXRlIG9iamVjdCwgZ2V0cyBjdXJyZW50IGlmIG51bGxcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCB7IHRlbXAsIFwiY29uZGl0aW9uXCIgfSlcbiAgICAgKi9cblxuICAgIEZvcmVjYXN0SU8ucHJvdG90eXBlLmdldEZvcmVjYXN0ID0gZnVuY3Rpb24odGltZSwgY2IpIHtcbiAgICAgIHZhciBxdWVyeVN0cmluZztcbiAgICAgIHF1ZXJ5U3RyaW5nID0gXCJcIiArIHRoaXMubG9jYXRpb24ubGF0aXR1ZGUgKyBcIixcIiArIHRoaXMubG9jYXRpb24ubG9uZ2l0dWRlO1xuICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gXCIsXCIgKyAodGhpcy5nZXRWYWxpZFRpbWVTdHJpbmcodGltZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgIHVybDogXCJcIiArIHRoaXMuZm9yZWNhc3Rpb1VyaSArIFwiL1wiICsgdGhpcy5hcGlLZXkgKyBcIi9cIiArIHF1ZXJ5U3RyaW5nLFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsXG4gICAgICAgICAgJyonOiAnKidcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZm9yZWNhc3REYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHtcbiAgICAgICAgICAgIHRlbXA6IGZvcmVjYXN0RGF0YS5jdXJyZW50bHkuYXBwYXJlbnRUZW1wZXJhdHVyZSxcbiAgICAgICAgICAgIGNvbmRpdGlvbjogZm9yZWNhc3REYXRhLmN1cnJlbnRseS5pY29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRm9yZWNhc3RJTztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IEZvcmVjYXN0SU8oZm9yZWNhc3Rpb1NldHRpbmdzLmFwaV9rZXksIGZvcmVjYXN0aW9TZXR0aW5ncy5mb3JlY2FzdF9yZWZyZXNoLCB7XG4gICAgbGF0aXR1ZGU6IGZvcmVjYXN0aW9TZXR0aW5ncy5sYXRpdHVkZSxcbiAgICBsb25naXR1ZGU6IGZvcmVjYXN0aW9TZXR0aW5ncy5sb25naXR1ZGVcbiAgfSwgZm9yZWNhc3Rpb1NldHRpbmdzLnRvbmlnaHRfaG91ciwgZm9yZWNhc3Rpb1NldHRpbmdzLnRvbW9ycm93X2hvdXIpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgSGFja2VyTmV3cywgaG5TZXR0aW5ncywgXztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBoblNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuaG47XG5cbiAgSGFja2VyTmV3cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBIYWNrZXJOZXdzKHJlZnJlc2hJbnRlcnZhbCkge1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmhuVXJpID0gJ2h0dHBzOi8vaGFja2VyLW5ld3MuZmlyZWJhc2Vpby5jb20vdjAnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIEhhY2tlciBOZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCApXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRUb3BTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvdG9wc3Rvcmllcy5qc29uXCIsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHZhciBzdG9yeUlkcztcbiAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGhhY2tlciBuZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvbmV3c3Rvcmllcy5qc29uXCIsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHZhciBzdG9yeUlkcztcbiAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiBnZXRzIHRoZSBzdG9yeSBjb250ZW50IGZvciBnaXZlbiBzdG9yeSBpZHNcbiAgICAgICogQHBhcmFtIDogW2lkc11cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRTdG9yaWVzID0gZnVuY3Rpb24oaWRzLCBjYikge1xuICAgICAgdmFyIGFqYXhFcnIsIHN0b3JpZXM7XG4gICAgICBzdG9yaWVzID0gW107XG4gICAgICBhamF4RXJyID0gbnVsbDtcbiAgICAgIHJldHVybiBfLmVhY2goaWRzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlkLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIF90aGlzLmhuVXJpICsgXCIvaXRlbS9cIiArIGlkICsgXCIuanNvblwiLCB7fSkuZG9uZShmdW5jdGlvbihzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGhudXJsLCBwcm9jZXNzZWQ7XG4gICAgICAgICAgICBobnVybCA9IF90aGlzLmdldEhOU3RvcnlVcmwoc3RvcnkuaWQpO1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0ge1xuICAgICAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgICAgIHVybDogc3RvcnkudXJsID8gc3RvcnkudXJsIDogaG51cmwsXG4gICAgICAgICAgICAgIGhudXJsOiBobnVybCxcbiAgICAgICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLFxuICAgICAgICAgICAgICBhdXRob3I6IHN0b3J5LmJ5LFxuICAgICAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmtpZHMgPyBzdG9yeS5raWRzLmxlbmd0aCA6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0SE5TdG9yeVVybCA9IGZ1bmN0aW9uKHN0b3J5SWQpIHtcbiAgICAgIHJldHVybiBcImh0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20vaXRlbT9pZD1cIiArIHN0b3J5SWQ7XG4gICAgfTtcblxuICAgIHJldHVybiBIYWNrZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgSGFja2VyTmV3cyhoblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuXG4vKlxuICAqIFB1YmxpYyBTZXR0aW5nc1xuICAqIEBkZXNjIDogdGhpcyBhIHB1YmxpYyB2ZXJzaW9uIG9mIHRoZSBzZXR0aW5ncyBmaWxlIHNob3dpbmcgaXQncyBzdHJ1Y3R1cmUsXG4gICogICAgICAgICBpdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCwgYW5kIEkgY2FuJ3QgcG9zdCBtaW5lIGFzIGl0IGNvbnRhaW5zXG4gICogICAgICAgICBBUEkga2V5cyBhbmQgY3JlZGVudGlhbHMhIFJlbmFtZSB0aGlzIHRvIHNldHRpbmdzLmNvZmZlZSBhbmRcbiAgKiAgICAgICAgIGZpbGwgaW4geW91ciBvd24gaW5mb3JtYXRpb24uXG4gICogQGF1dGhvciA6IFR5bGVyIEZvd2xlciA8dHlsZXJmb3dsZXIuMTMzN0BnbWFpbC5jb20+XG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgc2V0U2V0dGluZ3MsIHNldHRpbmdzS2V5TmFtZTtcblxuICBzZXR0aW5nc0tleU5hbWUgPSAnc2V0dGluZ3MnO1xuXG4gIHdpbmRvdy5yZXNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIHNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldHRpbmdzO1xuICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2V0dGluZ3NLZXlOYW1lKSkge1xuICAgICAgc2V0dGluZ3MgPSB7XG5cbiAgICAgICAgLyogRGVzaWduZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBkbjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIGNsaWVudF9pZDogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnPGluc2VydCB5b3Vycz4nLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaTogJzxpbnNlcnQgeW91cnM+J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEhhY2tlciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGhuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDBcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBGb3JlY2FzdC5pbyBTZXR0aW5ncyAqL1xuICAgICAgICBmb3JlY2FzdGlvOiB7XG4gICAgICAgICAgYXBpX2tleTogJzxpbnNlcnQgeW91cnM+JyxcbiAgICAgICAgICBmb3JlY2FzdF9yZWZyZXNoOiA2MCAqIDYwICogMTAwMCxcbiAgICAgICAgICB0b25pZ2h0X2hvdXI6IDIxLFxuICAgICAgICAgIHRvbW9ycm93X2hvdXI6IDEyLFxuICAgICAgICAgIGNpdHlfbmFtZTogJ0tDJyxcbiAgICAgICAgICBsYXRpdHVkZTogJzM5LjA2MjgxNjgnLFxuICAgICAgICAgIGxvbmdpdHVkZTogJy05NC41ODA5NDQ5JyxcbiAgICAgICAgICB0aW1lem9uZTogJzE3eidcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzZXR0aW5nc0tleU5hbWUsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgfVxuICB9O1xuXG4gIHNldFNldHRpbmdzKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG5cbi8qXG4gICogUHVibGljIFNldHRpbmdzXG4gICogQGRlc2MgOiB0aGlzIGEgcHVibGljIHZlcnNpb24gb2YgdGhlIHNldHRpbmdzIGZpbGUgc2hvd2luZyBpdCdzIHN0cnVjdHVyZSxcbiAgKiAgICAgICAgIGl0IGlzIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkLCBhbmQgSSBjYW4ndCBwb3N0IG1pbmUgYXMgaXQgY29udGFpbnNcbiAgKiAgICAgICAgIEFQSSBrZXlzIGFuZCBjcmVkZW50aWFscyEgUmVuYW1lIHRoaXMgdG8gc2V0dGluZ3MuY29mZmVlIGFuZFxuICAqICAgICAgICAgZmlsbCBpbiB5b3VyIG93biBpbmZvcm1hdGlvbi5cbiAgKiBAYXV0aG9yIDogVHlsZXIgRm93bGVyIDx0eWxlcmZvd2xlci4xMzM3QGdtYWlsLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBzZXRTZXR0aW5ncywgc2V0dGluZ3NLZXlOYW1lO1xuXG4gIHNldHRpbmdzS2V5TmFtZSA9ICdzZXR0aW5ncyc7XG5cbiAgd2luZG93LnJlc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICByZXR1cm4gbG9jYXRpb24ucmVsb2FkKCk7XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2V0dGluZ3M7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzZXR0aW5nc0tleU5hbWUpKSB7XG4gICAgICBzZXR0aW5ncyA9IHtcblxuICAgICAgICAvKiBEZXNpZ25lciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGRuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgY2xpZW50X2lkOiAnNzIzNWE1YTVhN2Q3MmE0N2Y5MjFiMWUwZWIyMWIyMTNkMjA5ZTBkMzc2MWM2YTNiY2QzZDAxOGQ2ZDMxZDI2ZicsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJzg3YjRhMGE4ODk3ZjRhYzZjZGQ2MTVjZDk4YjY1Y2JiZjBlYjgwYWM5NDliYWYzYTRmMjgyNmE5YjE2MzBjZDcnLFxuICAgICAgICAgIHJlZGlyZWN0X3VyaTogJ3VybjppZXRmOndnOm9hdXRoOjIuMDpvb2InXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogSGFja2VyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgaG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEZvcmVjYXN0LmlvIFNldHRpbmdzICovXG4gICAgICAgIGZvcmVjYXN0aW86IHtcbiAgICAgICAgICBhcGlfa2V5OiAnM2ViYzNmYjQyN2I4ZjhjNDlhNDA0NDZmZmU5ZmVhYzgnLFxuICAgICAgICAgIGZvcmVjYXN0X3JlZnJlc2g6IDYwICogNjAgKiAxMDAwLFxuICAgICAgICAgIHRvbmlnaHRfaG91cjogMjEsXG4gICAgICAgICAgdG9tb3Jyb3dfaG91cjogMTIsXG4gICAgICAgICAgY2l0eV9uYW1lOiAnS0MnLFxuICAgICAgICAgIGxhdGl0dWRlOiAnMzkuMDYyODE2OCcsXG4gICAgICAgICAgbG9uZ2l0dWRlOiAnLTk0LjU4MDk0NDknLFxuICAgICAgICAgIHRpbWV6b25lOiAnMTd6J1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNldHRpbmdzS2V5TmFtZSwgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcbiAgICB9XG4gIH07XG5cbiAgc2V0U2V0dGluZ3MoKTtcblxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
