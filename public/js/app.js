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
      console.log('Updating DN...');
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
      console.log('Updating HN...');
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

},{"../model/hn_store":7,"react":"react"}],5:[function(require,module,exports){
var React = require('react');

// TODO: this component should have 2 props:
// - cityName : Colloquial name for the city (i.e. 'KC')
// - city : Address of the city (i.e. Kansas City, MO, 64111 USA)

WeatherCard = React.createClass({displayName: "WeatherCard",
  getInitialState: function() {
    return {
      err: null,
      city: undefined,

      currentWeather: {
        temp: undefined,
        condition: undefined
      },

      futureWeather: {
        timeOfDay: undefined,
        temp: undefined,
        condition: undefined
      }
    };
  },

  fillMockupData: function() {
    this.setState({
      err: null,
      city: 'KC',

      currentWeather: {
        temp: 72,
        condition: 'Sunny'
      },

      futureWeather: {
        timeOfDay: 'Tonight',
        temp: 64,
        condition: 'Stormy'
      }
    });
  },

  componentDidMount: function() {
    this.fillMockupData();
  },

  render: function() {
    return (
      React.createElement("div", {className: "weather-card"}, 
        React.createElement("div", {className: "city"}, 
          React.createElement("span", null, this.state.city)
        )
      )
    );
  }
});

module.exports = WeatherCard;

},{"react":"react"}],6:[function(require,module,exports){
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

},{"jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
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
        }
      };
      return localStorage.setItem(settingsKeyName, JSON.stringify(settings));
    }
  };

  setSettings();

}).call(this);

},{}]},{},[1,2,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Nsb2NrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9kbi5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvaG4uanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL3dlYXRoZXJfY2FyZC5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2RuX3N0b3JlLmpzIiwic3JjL2FwcC9fYnVpbGQvbW9kZWwvaG5fc3RvcmUuanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8vIENvbXBvbmVudHNcbnZhciBDbG9jayAgICAgICA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jbG9jaycpO1xudmFyIEROTGlzdCAgICAgID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RuJyk7XG52YXIgSE5MaXN0ICAgICAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaG4nKTtcbnZhciBXZWF0aGVyQ2FyZCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy93ZWF0aGVyX2NhcmQnKTtcblxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFwcFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkxpc3QsIHtzaG93VG9wOiBmYWxzZSwgbWF4U3RvcmllczogOX0pXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjZW50ZXItcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDbG9jaywgbnVsbCksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndpZGdldC1jb250YWluZXJcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtd2lkZ2V0XCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWF0aGVyQ2FyZCwgbnVsbClcbiAgICAgICAgICAgICksIFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicmlnaHQtd2lkZ2V0IHN1bnJpc2UtY2FyZFwifVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJvb2ttYXJrLWNvbnRhaW5lclwifVxuXG4gICAgICAgICAgKVxuXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyaWdodC1wYW5lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhOTGlzdCwge3Nob3dUb3A6IGZhbHNlLCBtYXhTdG9yaWVzOiA5fSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXBwLCBudWxsKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKVxuKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBtb250aE5hbWVzID0gWyAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXG4gICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlcicgXTtcblxudmFyIENsb2NrID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNsb2NrXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgdGltZToge30gfTtcbiAgfSxcblxuICB1cGRhdGVUaW1lRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciB0aW1lT2JqID0ge307XG5cbiAgICAvLyBob3VycyBhcmUgaW4gbWlsaXRhcnkgdGltZVxuICAgIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPT09IDEyKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdQTSc7XG4gICAgfSBlbHNlIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPiAxMikge1xuICAgICAgdGltZU9iai5ob3VycyA9IGN1ckRhdGUuZ2V0SG91cnMoKSAtIDEyO1xuICAgICAgdGltZU9iai5wZXJpb2QgPSAnUE0nO1xuICAgIH0gZWxzZSBpZiAoY3VyRGF0ZS5nZXRIb3VycygpID09PSAwKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdBTSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSBjdXJEYXRlLmdldEhvdXJzKCk7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdBTSc7XG4gICAgfVxuXG5cbiAgICAvLyB3ZSBhbHdheXMgd2FudCB0aGUgdGltZSB0byBiZSAyIGRpZ2lzIChpLmUuIDA5IGluc3RlYWQgb2YgOSlcbiAgICBtaW5zID0gY3VyRGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgdGltZU9iai5taW51dGVzID0gbWlucyA+IDkgPyAnJyArIG1pbnMgOiAnMCcgKyBtaW5zO1xuXG4gICAgdGltZU9iai5tb250aCA9IG1vbnRoTmFtZXNbY3VyRGF0ZS5nZXRNb250aCgpXTtcbiAgICB0aW1lT2JqLmRheSA9IGN1ckRhdGUuZ2V0RGF0ZSgpO1xuICAgIHRpbWVPYmoueWVhciA9IGN1ckRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoeyB0aW1lOiB0aW1lT2JqIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVwZGF0ZVRpbWVEYXRhKCk7XG4gICAgc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVUaW1lRGF0YSwgMTAwMCk7IC8vIHVwZGF0ZSBldmVyeSBzZWNvbmRcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2xvY2tcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGltZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIHtpZDogXCJjdXItdGltZVwifSwgdGhpcy5zdGF0ZS50aW1lLmhvdXJzLCBcIjpcIiwgdGhpcy5zdGF0ZS50aW1lLm1pbnV0ZXMpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7aWQ6IFwiY3VyLXBlcmlvZFwifSwgdGhpcy5zdGF0ZS50aW1lLnBlcmlvZClcbiAgICAgICAgKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJkaXZpZGVyXCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJkYXRlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7aWQ6IFwiY3VyLWRhdGVcIn0sIHRoaXMuc3RhdGUudGltZS5tb250aCwgXCIgXCIsIHRoaXMuc3RhdGUudGltZS5kYXksIFwiLCBcIiwgdGhpcy5zdGF0ZS50aW1lLnllYXIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbG9jaztcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgZG4gICAgPSByZXF1aXJlKCcuLi9tb2RlbC9kbl9zdG9yZScpO1xuXG5ETkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRE5MaXN0XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgc3RvcmllczogW10sIGVycjogbnVsbCB9O1xuICB9LFxuXG4gIGRuQ2I6IGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgIGlmIChlcnIpIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBbXSwgZXJyOiBlcnIgfSk7XG4gICAgZWxzZSB0aGlzLnNldFN0YXRlKHsgc3Rvcmllczogc3RvcmllcywgZXJyOiBudWxsIH0pO1xuICB9LFxuXG4gIGxvYWREblN0b3JpZXM6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvd1RvcCA9PT0gdHJ1ZSlcbiAgICAgIGRuLmdldFRvcFN0b3JpZXMobGltaXQsIHRoaXMuZG5DYik7XG4gICAgZWxzZVxuICAgICAgZG4uZ2V0UmVjZW50U3RvcmllcyhsaW1pdCwgdGhpcy5kbkNiKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkRG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG5cbiAgICBzZXRJbnRlcnZhbCgoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcbiAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGluZyBETi4uLicpO1xuICAgIH0pLmJpbmQodGhpcyksIGRuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgLy8gcmVuZGVyRXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAvLyAgIHJldHVybiAoXG4gIC8vXG4gIC8vICAgKVxuICAvLyB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gZG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5kbnVybCwgXG4gICAgICAgICAgdXB2b3Rlczogc3RvcnkudXB2b3RlcywgXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS5hdXRob3IsIFxuICAgICAgICAgIGNvbW1lbnRDb3VudDogc3RvcnkuY29tbWVudENvdW50fVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWRpbmc7XG4gICAgaWYgKGRubGlzdC5sZW5ndGggPT09IDApXG4gICAgICBsb2FkaW5nID0gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgZWxzZVxuICAgICAgbG9hZGluZyA9ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGRuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBkbi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkRlc2lnbmVyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgZG5saXN0XCJ9LCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBkbmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgRE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkROSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnZG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgLy8gVE9ETzogbWFrZSBpdCBzYXkgMSBjb21tZW50IGluc3RlYWQgb2YgMSBjb21tZW50c1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBkbi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy51cHZvdGVzLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5kbnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBETkxpc3Q7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGhuICAgID0gcmVxdWlyZSgnLi4vbW9kZWwvaG5fc3RvcmUnKTtcblxuSE5MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOTGlzdFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHN0b3JpZXM6IFtdLCBlcnI6IG51bGwgfTtcbiAgfSxcblxuICBobkNiOiBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICBpZiAoZXJyKSB0aGlzLnNldFN0YXRlKHsgc3RvcmllczogW10sIGVycjogZXJyIH0pO1xuICAgIGVsc2UgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IHN0b3JpZXMsIGVycjogbnVsbCB9KTtcbiAgfSxcblxuICBsb2FkSG5TdG9yaWVzOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3dUb3AgPT09IHRydWUpXG4gICAgICBobi5nZXRUb3BTdG9yaWVzKGxpbWl0LCB0aGlzLmhuQ2IpO1xuICAgIGVsc2VcbiAgICAgIGhuLmdldFJlY2VudFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZEhuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuXG4gICAgc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG4gICAgICBjb25zb2xlLmxvZygnVXBkYXRpbmcgSE4uLi4nKTtcbiAgICB9KS5iaW5kKHRoaXMpLCBobi5yZWZyZXNoSW50ZXJ2YWwpO1xuICB9LFxuXG4gIHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmVlZC1sb2FkaW5nLWFuaW0gaG4tbG9hZGluZ1wifVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG5saXN0ID0gdGhpcy5zdGF0ZS5zdG9yaWVzLm1hcChmdW5jdGlvbihzdG9yeSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5JdGVtLCB7c3RvcnlJZDogaW5kZXgsIFxuICAgICAgICAgIHRpdGxlOiBzdG9yeS50aXRsZSwgXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsIFxuICAgICAgICAgIGhudXJsOiBzdG9yeS5obnVybCwgXG4gICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoaG5saXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgIGxvYWRpbmcgPSB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICBlbHNlXG4gICAgICBsb2FkaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lIGhuLWNvbnRhaW5lclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwYW5lLWhlYWRlciBobi1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIkhhY2tlciBOZXdzXCIpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1saXN0IGhubGlzdFwifSwgXG4gICAgICAgICAgbG9hZGluZywgXG4gICAgICAgICAgaG5saXN0XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEhOSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJITkl0ZW1cIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbUlkID0gJ2huaXRlbS0nICsgdGhpcy5wcm9wcy5zdG9yeUlkO1xuICAgIHZhciBjb21tZW50VGV4dCA9IHRoaXMucHJvcHMuY29tbWVudENvdW50ID09PSAxID8gJ2NvbW1lbnQnIDogJ2NvbW1lbnRzJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaXRlbSBobi1pdGVtXCIsIGlkOiBpdGVtSWR9LCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktaW5kZXhcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMucHJvcHMuc3RvcnlJZCArIDEpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCB0aGlzLnByb3BzLnRpdGxlKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbWV0YWRhdGFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktdXB2b3Rlc1wifSwgdGhpcy5wcm9wcy5zY29yZSwgXCIgdXB2b3Rlc1wiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVwdm90ZS1pY29uXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWF1dGhvclwifSwgdGhpcy5wcm9wcy5hdXRob3IpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktZGF0YS1kaXZpZGVyXCJ9KSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWNvbW1lbnRzXCIsIGhyZWY6IHRoaXMucHJvcHMuaG51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21tZW50Q291bnQsIFwiIFwiLCBjb21tZW50VGV4dFxuICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSE5MaXN0O1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLy8gVE9ETzogdGhpcyBjb21wb25lbnQgc2hvdWxkIGhhdmUgMiBwcm9wczpcbi8vIC0gY2l0eU5hbWUgOiBDb2xsb3F1aWFsIG5hbWUgZm9yIHRoZSBjaXR5IChpLmUuICdLQycpXG4vLyAtIGNpdHkgOiBBZGRyZXNzIG9mIHRoZSBjaXR5IChpLmUuIEthbnNhcyBDaXR5LCBNTywgNjQxMTEgVVNBKVxuXG5XZWF0aGVyQ2FyZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJXZWF0aGVyQ2FyZFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IG51bGwsXG4gICAgICBjaXR5OiB1bmRlZmluZWQsXG5cbiAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgIHRlbXA6IHVuZGVmaW5lZCxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH0sXG5cbiAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgdGltZU9mRGF5OiB1bmRlZmluZWQsXG4gICAgICAgIHRlbXA6IHVuZGVmaW5lZCxcbiAgICAgICAgY29uZGl0aW9uOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGZpbGxNb2NrdXBEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycjogbnVsbCxcbiAgICAgIGNpdHk6ICdLQycsXG5cbiAgICAgIGN1cnJlbnRXZWF0aGVyOiB7XG4gICAgICAgIHRlbXA6IDcyLFxuICAgICAgICBjb25kaXRpb246ICdTdW5ueSdcbiAgICAgIH0sXG5cbiAgICAgIGZ1dHVyZVdlYXRoZXI6IHtcbiAgICAgICAgdGltZU9mRGF5OiAnVG9uaWdodCcsXG4gICAgICAgIHRlbXA6IDY0LFxuICAgICAgICBjb25kaXRpb246ICdTdG9ybXknXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZmlsbE1vY2t1cERhdGEoKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwid2VhdGhlci1jYXJkXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNpdHlcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIHRoaXMuc3RhdGUuY2l0eSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXRoZXJDYXJkO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgRGVzaWduZXJOZXdzLCBkblNldHRpbmdzLCBfO1xuXG4gICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIGRuU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXR0aW5ncycpKS5kbjtcblxuICBEZXNpZ25lck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRGVzaWduZXJOZXdzKGNsaWVudElkLCBjbGllbnRTZWNyZXQsIHJlZGlyZWN0VXJpLCByZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gY2xpZW50U2VjcmV0O1xuICAgICAgdGhpcy5yZWRpcmVjdFVyaSA9IHJlZGlyZWN0VXJpO1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmRuVXJpID0gJ2h0dHBzOi8vYXBpLW5ld3MubGF5ZXJ2YXVsdC5jb20vYXBpL3YxJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudF9jb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXM/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGRlc2lnbmVyIG5ld3NcbiAgICAgICogQHBhcmFtIDogbGltaXQgLSBtYXggbnVtYmVyIG9mIHN0b3JpZXMgdG8gZ3JhYlxuICAgICAgKiBAY2FsbHMgOiBjYihlcnIsIFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5kblVyaSArIFwiL3N0b3JpZXMvcmVjZW50P2NsaWVudF9pZD1cIiArIHRoaXMuY2xpZW50SWQsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzU3RvcmllcyhkYXRhLnN0b3JpZXMuc2xpY2UoMCwgbGltaXQpLCBmdW5jdGlvbihzdG9yaWVzKSB7XG4gICAgICAgICAgICBpZiAoc3Rvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUmVjZWl2ZWQgemVybyBzdG9yaWVzJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAqIERlc2lnbmVyTmV3cyNwcm9jZXNzU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHByb2Nlc3NlcyByYXcgRE4gc3RvcnkgZGF0YSBpbnRvIGEgc3RyaXBwZWQgZG93biBhcGlcbiAgICAgICogQHBhcmFtIDogWyB7IHN0b3JpZXMgfSBdXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0XG4gICAgICAqIEBjYWxscyA6IGNiKFt7IHRpdGxlLCB1cmwsIGRudXJsLCB1cHZvdGVzLCBhdXRob3IsIGNvbW1lbnRDb3VudCB9XSlcbiAgICAgKi9cblxuICAgIERlc2lnbmVyTmV3cy5wcm90b3R5cGUucHJvY2Vzc1N0b3JpZXMgPSBmdW5jdGlvbihzdG9yaWVzLCBjYikge1xuICAgICAgdmFyIHByb2Nlc3NlZFN0b3JpZXM7XG4gICAgICBwcm9jZXNzZWRTdG9yaWVzID0gW107XG4gICAgICByZXR1cm4gXy5lYWNoKHN0b3JpZXMsIGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgICB2YXIgcHJvY2Vzc2VkO1xuICAgICAgICBwcm9jZXNzZWQgPSB7XG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgIHVybDogc3RvcnkudXJsLFxuICAgICAgICAgIGRudXJsOiBzdG9yeS5zaXRlX3VybCxcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS52b3RlX2NvdW50LFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkudXNlcl9kaXNwbGF5X25hbWUsXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50cy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc2VkU3Rvcmllcy5wdXNoKHByb2Nlc3NlZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gc3Rvcmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKHByb2Nlc3NlZFN0b3JpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERlc2lnbmVyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IERlc2lnbmVyTmV3cyhkblNldHRpbmdzLmNsaWVudF9pZCwgZG5TZXR0aW5ncy5jbGllbnRfc2VjcmV0LCBkblNldHRpbmdzLnJlZGlyZWN0X3VyaSwgZG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEhhY2tlck5ld3MsIGhuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgaG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmhuO1xuXG4gIEhhY2tlck5ld3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gSGFja2VyTmV3cyhyZWZyZXNoSW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMucmVmcmVzaEludGVydmFsID0gcmVmcmVzaEludGVydmFsO1xuICAgICAgdGhpcy5oblVyaSA9ICdodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICAqIEhhY2tlck5ld3MjZ2V0VG9wU3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgdG9wIHN0b3JpZXMgZnJvbSBIYWNrZXIgTmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0VG9wU3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5oblVyaSArIFwiL3RvcHN0b3JpZXMuanNvblwiLCB7fSkuZG9uZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICB2YXIgc3RvcnlJZHM7XG4gICAgICAgICAgc3RvcnlJZHMgPSBkYXRhLnNsaWNlKDAsIGxpbWl0KTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RvcmllcyhzdG9yeUlkcywgZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRSZWNlbnRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSBsYXRlc3Qgc3RyZWFtIG9mIHN0b3JpZXMgZnJvbSBoYWNrZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgc2NvcmUsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0UmVjZW50U3RvcmllcyA9IGZ1bmN0aW9uKGxpbWl0LCBjYikge1xuICAgICAgcmV0dXJuICQuZ2V0SlNPTihcIlwiICsgdGhpcy5oblVyaSArIFwiL25ld3N0b3JpZXMuanNvblwiLCB7fSkuZG9uZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICB2YXIgc3RvcnlJZHM7XG4gICAgICAgICAgc3RvcnlJZHMgPSBkYXRhLnNsaWNlKDAsIGxpbWl0KTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RvcmllcyhzdG9yeUlkcywgZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogZ2V0cyB0aGUgc3RvcnkgY29udGVudCBmb3IgZ2l2ZW4gc3RvcnkgaWRzXG4gICAgICAqIEBwYXJhbSA6IFtpZHNdXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgc2NvcmUsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0U3RvcmllcyA9IGZ1bmN0aW9uKGlkcywgY2IpIHtcbiAgICAgIHZhciBhamF4RXJyLCBzdG9yaWVzO1xuICAgICAgc3RvcmllcyA9IFtdO1xuICAgICAgYWpheEVyciA9IG51bGw7XG4gICAgICByZXR1cm4gXy5lYWNoKGlkcywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpZCwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyBfdGhpcy5oblVyaSArIFwiL2l0ZW0vXCIgKyBpZCArIFwiLmpzb25cIiwge30pLmRvbmUoZnVuY3Rpb24oc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBobnVybCwgcHJvY2Vzc2VkO1xuICAgICAgICAgICAgaG51cmwgPSBfdGhpcy5nZXRITlN0b3J5VXJsKHN0b3J5LmlkKTtcbiAgICAgICAgICAgIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLFxuICAgICAgICAgICAgICB1cmw6IHN0b3J5LnVybCA/IHN0b3J5LnVybCA6IGhudXJsLFxuICAgICAgICAgICAgICBobnVybDogaG51cmwsXG4gICAgICAgICAgICAgIHNjb3JlOiBzdG9yeS5zY29yZSxcbiAgICAgICAgICAgICAgYXV0aG9yOiBzdG9yeS5ieSxcbiAgICAgICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5raWRzID8gc3Rvcnkua2lkcy5sZW5ndGggOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3Rvcmllcy5wdXNoKHByb2Nlc3NlZCk7XG4gICAgICAgICAgICBpZiAoc3Rvcmllcy5sZW5ndGggPT09IGlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHN0b3JpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCBlcnJNc2csIGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIEhhY2tlck5ld3MucHJvdG90eXBlLmdldEhOU3RvcnlVcmwgPSBmdW5jdGlvbihzdG9yeUlkKSB7XG4gICAgICByZXR1cm4gXCJodHRwczovL25ld3MueWNvbWJpbmF0b3IuY29tL2l0ZW0/aWQ9XCIgKyBzdG9yeUlkO1xuICAgIH07XG5cbiAgICByZXR1cm4gSGFja2VyTmV3cztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gbmV3IEhhY2tlck5ld3MoaG5TZXR0aW5ncy5yZWZyZXNoX2ludGVydmFsX21zKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcblxuLypcbiAgKiBQdWJsaWMgU2V0dGluZ3NcbiAgKiBAZGVzYyA6IHRoaXMgYSBwdWJsaWMgdmVyc2lvbiBvZiB0aGUgc2V0dGluZ3MgZmlsZSBzaG93aW5nIGl0J3Mgc3RydWN0dXJlLFxuICAqICAgICAgICAgaXQgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQsIGFuZCBJIGNhbid0IHBvc3QgbWluZSBhcyBpdCBjb250YWluc1xuICAqICAgICAgICAgQVBJIGtleXMgYW5kIGNyZWRlbnRpYWxzISBSZW5hbWUgdGhpcyB0byBzZXR0aW5ncy5jb2ZmZWUgYW5kXG4gICogICAgICAgICBmaWxsIGluIHlvdXIgb3duIGluZm9ybWF0aW9uLlxuICAqIEBhdXRob3IgOiBUeWxlciBGb3dsZXIgPHR5bGVyZm93bGVyLjEzMzdAZ21haWwuY29tPlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIHNldFNldHRpbmdzLCBzZXR0aW5nc0tleU5hbWU7XG5cbiAgc2V0dGluZ3NLZXlOYW1lID0gJ3NldHRpbmdzJztcblxuICB3aW5kb3cucmVzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJldHVybiBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfTtcblxuICBzZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXR0aW5ncztcbiAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHNldHRpbmdzS2V5TmFtZSkpIHtcbiAgICAgIHNldHRpbmdzID0ge1xuXG4gICAgICAgIC8qIERlc2lnbmVyIE5ld3MgU2V0dGluZ3MgKi9cbiAgICAgICAgZG46IHtcbiAgICAgICAgICByZWZyZXNoX2ludGVydmFsX21zOiAxNSAqIDYwICogMTAwMCxcbiAgICAgICAgICBjbGllbnRfaWQ6ICc3MjM1YTVhNWE3ZDcyYTQ3ZjkyMWIxZTBlYjIxYjIxM2QyMDllMGQzNzYxYzZhM2JjZDNkMDE4ZDZkMzFkMjZmJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnODdiNGEwYTg4OTdmNGFjNmNkZDYxNWNkOThiNjVjYmJmMGViODBhYzk0OWJhZjNhNGYyODI2YTliMTYzMGNkNycsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiAndXJuOmlldGY6d2c6b2F1dGg6Mi4wOm9vYidcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBIYWNrZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBobjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2V0dGluZ3NLZXlOYW1lLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgIH1cbiAgfTtcblxuICBzZXRTZXR0aW5ncygpO1xuXG59KS5jYWxsKHRoaXMpO1xuIl19
