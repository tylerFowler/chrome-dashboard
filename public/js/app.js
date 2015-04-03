(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');

// Components
var Clock = require('./components/clock');
var DNList = require('./components/dn');
var HNList = require('./components/hn');


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
            React.createElement("div", {className: "left-widget weather-card"}
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

},{"./components/clock":2,"./components/dn":3,"./components/hn":4,"react":"react"}],2:[function(require,module,exports){
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

},{"../model/dn_store":5,"react":"react"}],4:[function(require,module,exports){
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

},{"../model/hn_store":6,"react":"react"}],5:[function(require,module,exports){
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

},{"jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
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

},{"jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL19idWlsZC9hcHAuanMiLCJzcmMvYXBwL19idWlsZC9jb21wb25lbnRzL2Nsb2NrLmpzIiwic3JjL2FwcC9fYnVpbGQvY29tcG9uZW50cy9kbi5qcyIsInNyYy9hcHAvX2J1aWxkL2NvbXBvbmVudHMvaG4uanMiLCJzcmMvYXBwL19idWlsZC9tb2RlbC9kbl9zdG9yZS5qcyIsInNyYy9hcHAvX2J1aWxkL21vZGVsL2huX3N0b3JlLmpzIiwic3JjL2FwcC9fYnVpbGQvbW9kZWwvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vLyBDb21wb25lbnRzXG52YXIgQ2xvY2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2xvY2snKTtcbnZhciBETkxpc3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZG4nKTtcbnZhciBITkxpc3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaG4nKTtcblxuXG52YXIgQXBwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFwcFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkxpc3QsIHtzaG93VG9wOiBmYWxzZSwgbWF4U3RvcmllczogOX0pXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjZW50ZXItcGFuZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDbG9jaywgbnVsbCksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIndpZGdldC1jb250YWluZXJcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxlZnQtd2lkZ2V0IHdlYXRoZXItY2FyZFwifVxuICAgICAgICAgICAgKSwgXG5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyaWdodC13aWRnZXQgc3VucmlzZS1jYXJkXCJ9XG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYm9va21hcmstY29udGFpbmVyXCJ9XG5cbiAgICAgICAgICApXG5cbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJpZ2h0LXBhbmVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSE5MaXN0LCB7c2hvd1RvcDogZmFsc2UsIG1heFN0b3JpZXM6IDl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIG1vbnRoTmFtZXMgPSBbICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcbiAgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdO1xuXG52YXIgQ2xvY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2xvY2tcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyB0aW1lOiB7fSB9O1xuICB9LFxuXG4gIHVwZGF0ZVRpbWVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHRpbWVPYmogPSB7fTtcblxuICAgIC8vIGhvdXJzIGFyZSBpbiBtaWxpdGFyeSB0aW1lXG4gICAgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA9PT0gMTIpIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ1BNJztcbiAgICB9IGVsc2UgaWYgKGN1ckRhdGUuZ2V0SG91cnMoKSA+IDEyKSB7XG4gICAgICB0aW1lT2JqLmhvdXJzID0gY3VyRGF0ZS5nZXRIb3VycygpIC0gMTI7XG4gICAgICB0aW1lT2JqLnBlcmlvZCA9ICdQTSc7XG4gICAgfSBlbHNlIGlmIChjdXJEYXRlLmdldEhvdXJzKCkgPT09IDApIHtcbiAgICAgIHRpbWVPYmouaG91cnMgPSAxMjtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZU9iai5ob3VycyA9IGN1ckRhdGUuZ2V0SG91cnMoKTtcbiAgICAgIHRpbWVPYmoucGVyaW9kID0gJ0FNJztcbiAgICB9XG5cblxuICAgIC8vIHdlIGFsd2F5cyB3YW50IHRoZSB0aW1lIHRvIGJlIDIgZGlnaXMgKGkuZS4gMDkgaW5zdGVhZCBvZiA5KVxuICAgIG1pbnMgPSBjdXJEYXRlLmdldE1pbnV0ZXMoKTtcbiAgICB0aW1lT2JqLm1pbnV0ZXMgPSBtaW5zID4gOSA/ICcnICsgbWlucyA6ICcwJyArIG1pbnM7XG5cbiAgICB0aW1lT2JqLm1vbnRoID0gbW9udGhOYW1lc1tjdXJEYXRlLmdldE1vbnRoKCldO1xuICAgIHRpbWVPYmouZGF5ID0gY3VyRGF0ZS5nZXREYXRlKCk7XG4gICAgdGltZU9iai55ZWFyID0gY3VyRGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWU6IHRpbWVPYmogfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlVGltZURhdGEoKTtcbiAgICBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZVRpbWVEYXRhLCAxMDAwKTsgLy8gdXBkYXRlIGV2ZXJ5IHNlY29uZFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjbG9ja1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aW1lXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDFcIiwge2lkOiBcImN1ci10aW1lXCJ9LCB0aGlzLnN0YXRlLnRpbWUuaG91cnMsIFwiOlwiLCB0aGlzLnN0YXRlLnRpbWUubWludXRlcyksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItcGVyaW9kXCJ9LCB0aGlzLnN0YXRlLnRpbWUucGVyaW9kKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRpdmlkZXJcIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRhdGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJjdXItZGF0ZVwifSwgdGhpcy5zdGF0ZS50aW1lLm1vbnRoLCBcIiBcIiwgdGhpcy5zdGF0ZS50aW1lLmRheSwgXCIsIFwiLCB0aGlzLnN0YXRlLnRpbWUueWVhcilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsb2NrO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBkbiAgICA9IHJlcXVpcmUoJy4uL21vZGVsL2RuX3N0b3JlJyk7XG5cbkROTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJETkxpc3RcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyBzdG9yaWVzOiBbXSwgZXJyOiBudWxsIH07XG4gIH0sXG5cbiAgZG5DYjogZnVuY3Rpb24oZXJyLCBzdG9yaWVzKSB7XG4gICAgaWYgKGVycikgdGhpcy5zZXRTdGF0ZSh7IHN0b3JpZXM6IFtdLCBlcnI6IGVyciB9KTtcbiAgICBlbHNlIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBzdG9yaWVzLCBlcnI6IG51bGwgfSk7XG4gIH0sXG5cbiAgbG9hZERuU3RvcmllczogZnVuY3Rpb24obGltaXQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93VG9wID09PSB0cnVlKVxuICAgICAgZG4uZ2V0VG9wU3RvcmllcyhsaW1pdCwgdGhpcy5kbkNiKTtcbiAgICBlbHNlXG4gICAgICBkbi5nZXRSZWNlbnRTdG9yaWVzKGxpbWl0LCB0aGlzLmRuQ2IpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWREblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcblxuICAgIHNldEludGVydmFsKChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubG9hZERuU3Rvcmllcyh0aGlzLnByb3BzLm1heFN0b3JpZXMpO1xuICAgICAgY29uc29sZS5sb2coJ1VwZGF0aW5nIEROLi4uJyk7XG4gICAgfSkuYmluZCh0aGlzKSwgZG4ucmVmcmVzaEludGVydmFsKTtcbiAgfSxcblxuICAvLyByZW5kZXJFcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgcmV0dXJuIChcbiAgLy9cbiAgLy8gICApXG4gIC8vIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBkbi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkbmxpc3QgPSB0aGlzLnN0YXRlLnN0b3JpZXMubWFwKGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChETkl0ZW0sIHtzdG9yeUlkOiBpbmRleCwgXG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLCBcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCwgXG4gICAgICAgICAgZG51cmw6IHN0b3J5LmRudXJsLCBcbiAgICAgICAgICB1cHZvdGVzOiBzdG9yeS51cHZvdGVzLCBcbiAgICAgICAgICBhdXRob3I6IHN0b3J5LmF1dGhvciwgXG4gICAgICAgICAgY29tbWVudENvdW50OiBzdG9yeS5jb21tZW50Q291bnR9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgbG9hZGluZztcbiAgICBpZiAoZG5saXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgIGxvYWRpbmcgPSB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICBlbHNlXG4gICAgICBsb2FkaW5nID0gJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgZG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGRuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiRGVzaWduZXIgTmV3c1wiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3RvcnktbGlzdCBkbmxpc3RcIn0sIFxuICAgICAgICAgIGxvYWRpbmcsIFxuICAgICAgICAgIGRubGlzdFxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBETkl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRE5JdGVtXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1JZCA9ICdkbml0ZW0tJyArIHRoaXMucHJvcHMuc3RvcnlJZDtcbiAgICB2YXIgY29tbWVudFRleHQgPSB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCA9PT0gMSA/ICdjb21tZW50JyA6ICdjb21tZW50cyc7XG5cbiAgICAvLyBUT0RPOiBtYWtlIGl0IHNheSAxIGNvbW1lbnQgaW5zdGVhZCBvZiAxIGNvbW1lbnRzXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pdGVtIGRuLWl0ZW1cIiwgaWQ6IGl0ZW1JZH0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pbmRleFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5wcm9wcy5zdG9yeUlkICsgMSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXRpdGxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIHRoaXMucHJvcHMudGl0bGUpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1tZXRhZGF0YVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS11cHZvdGVzXCJ9LCB0aGlzLnByb3BzLnVwdm90ZXMsIFwiIHVwdm90ZXNcIiksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1cHZvdGUtaWNvblwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS1hdXRob3JcIn0sIHRoaXMucHJvcHMuYXV0aG9yKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWRhdGEtZGl2aWRlclwifSksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1jb21tZW50c1wiLCBocmVmOiB0aGlzLnByb3BzLmRudXJsLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCBcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudENvdW50LCBcIiBcIiwgY29tbWVudFRleHRcbiAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEROTGlzdDtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgaG4gICAgPSByZXF1aXJlKCcuLi9tb2RlbC9obl9zdG9yZScpO1xuXG5ITkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSE5MaXN0XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgc3RvcmllczogW10sIGVycjogbnVsbCB9O1xuICB9LFxuXG4gIGhuQ2I6IGZ1bmN0aW9uKGVyciwgc3Rvcmllcykge1xuICAgIGlmIChlcnIpIHRoaXMuc2V0U3RhdGUoeyBzdG9yaWVzOiBbXSwgZXJyOiBlcnIgfSk7XG4gICAgZWxzZSB0aGlzLnNldFN0YXRlKHsgc3Rvcmllczogc3RvcmllcywgZXJyOiBudWxsIH0pO1xuICB9LFxuXG4gIGxvYWRIblN0b3JpZXM6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvd1RvcCA9PT0gdHJ1ZSlcbiAgICAgIGhuLmdldFRvcFN0b3JpZXMobGltaXQsIHRoaXMuaG5DYik7XG4gICAgZWxzZVxuICAgICAgaG4uZ2V0UmVjZW50U3RvcmllcyhsaW1pdCwgdGhpcy5obkNiKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkSG5TdG9yaWVzKHRoaXMucHJvcHMubWF4U3Rvcmllcyk7XG5cbiAgICBzZXRJbnRlcnZhbCgoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxvYWRIblN0b3JpZXModGhpcy5wcm9wcy5tYXhTdG9yaWVzKTtcbiAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGluZyBITi4uLicpO1xuICAgIH0pLmJpbmQodGhpcyksIGhuLnJlZnJlc2hJbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVuZGVyTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmZWVkLWxvYWRpbmctYW5pbSBobi1sb2FkaW5nXCJ9XG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBobmxpc3QgPSB0aGlzLnN0YXRlLnN0b3JpZXMubWFwKGZ1bmN0aW9uKHN0b3J5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChITkl0ZW0sIHtzdG9yeUlkOiBpbmRleCwgXG4gICAgICAgICAgdGl0bGU6IHN0b3J5LnRpdGxlLCBcbiAgICAgICAgICB1cmw6IHN0b3J5LnVybCwgXG4gICAgICAgICAgaG51cmw6IHN0b3J5LmhudXJsLCBcbiAgICAgICAgICBzY29yZTogc3Rvcnkuc2NvcmUsIFxuICAgICAgICAgIGF1dGhvcjogc3RvcnkuYXV0aG9yLCBcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRDb3VudH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBsb2FkaW5nO1xuICAgIGlmIChobmxpc3QubGVuZ3RoID09PSAwKVxuICAgICAgbG9hZGluZyA9IHRoaXMucmVuZGVyTG9hZGluZygpO1xuICAgIGVsc2VcbiAgICAgIGxvYWRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUgaG4tY29udGFpbmVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInBhbmUtaGVhZGVyIGhuLWhlYWRlclwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIG51bGwsIFwiSGFja2VyIE5ld3NcIilcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LWxpc3QgaG5saXN0XCJ9LCBcbiAgICAgICAgICBsb2FkaW5nLCBcbiAgICAgICAgICBobmxpc3RcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgSE5JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhOSXRlbVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtSWQgPSAnaG5pdGVtLScgKyB0aGlzLnByb3BzLnN0b3J5SWQ7XG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gdGhpcy5wcm9wcy5jb21tZW50Q291bnQgPT09IDEgPyAnY29tbWVudCcgOiAnY29tbWVudHMnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pdGVtIGhuLWl0ZW1cIiwgaWQ6IGl0ZW1JZH0sIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1pbmRleFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGhpcy5wcm9wcy5zdG9yeUlkICsgMSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN0b3J5LXRpdGxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy51cmwsIHRhcmdldDogXCJfYmxhbmtcIn0sIHRoaXMucHJvcHMudGl0bGUpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1tZXRhZGF0YVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzdG9yeS11cHZvdGVzXCJ9LCB0aGlzLnByb3BzLnNjb3JlLCBcIiB1cHZvdGVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXB2b3RlLWljb25cIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3RvcnktYXV0aG9yXCJ9LCB0aGlzLnByb3BzLmF1dGhvciksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdG9yeS1kYXRhLWRpdmlkZXJcIn0pLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwic3RvcnktY29tbWVudHNcIiwgaHJlZjogdGhpcy5wcm9wcy5obnVybCwgdGFyZ2V0OiBcIl9ibGFua1wifSwgXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnRDb3VudCwgXCIgXCIsIGNvbW1lbnRUZXh0XG4gICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBITkxpc3Q7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciAkLCBEZXNpZ25lck5ld3MsIGRuU2V0dGluZ3MsIF87XG5cbiAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgZG5TZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NldHRpbmdzJykpLmRuO1xuXG4gIERlc2lnbmVyTmV3cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBEZXNpZ25lck5ld3MoY2xpZW50SWQsIGNsaWVudFNlY3JldCwgcmVkaXJlY3RVcmksIHJlZnJlc2hJbnRlcnZhbCkge1xuICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xuICAgICAgdGhpcy5jbGllbnRTZWNyZXQgPSBjbGllbnRTZWNyZXQ7XG4gICAgICB0aGlzLnJlZGlyZWN0VXJpID0gcmVkaXJlY3RVcmk7XG4gICAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IHJlZnJlc2hJbnRlcnZhbDtcbiAgICAgIHRoaXMuZG5VcmkgPSAnaHR0cHM6Ly9hcGktbmV3cy5sYXllcnZhdWx0LmNvbS9hcGkvdjEnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI2dldFRvcFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIHRvcCBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgdXB2b3RlcywgYXV0aG9yLCBjb21tZW50X2NvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRUb3BTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcz9jbGllbnRfaWQ9XCIgKyB0aGlzLmNsaWVudElkLCB7fSkuZG9uZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvY2Vzc1N0b3JpZXMoZGF0YS5zdG9yaWVzLnNsaWNlKDAsIGxpbWl0KSwgZnVuY3Rpb24oc3Rvcmllcykge1xuICAgICAgICAgICAgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBEZXNpZ25lck5ld3MjZ2V0UmVjZW50U3Rvcmllc1xuICAgICAgKiBAZGVzYyA6IHJldHJpZXZlcyB0aGUgbGF0ZXN0IHN0cmVhbSBvZiBzdG9yaWVzIGZyb20gZGVzaWduZXIgbmV3c1xuICAgICAgKiBAcGFyYW0gOiBsaW1pdCAtIG1heCBudW1iZXIgb2Ygc3RvcmllcyB0byBncmFiXG4gICAgICAqIEBjYWxscyA6IGNiKGVyciwgW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmRuVXJpICsgXCIvc3Rvcmllcy9yZWNlbnQ/Y2xpZW50X2lkPVwiICsgdGhpcy5jbGllbnRJZCwge30pLmRvbmUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2Nlc3NTdG9yaWVzKGRhdGEuc3Rvcmllcy5zbGljZSgwLCBsaW1pdCksIGZ1bmN0aW9uKHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdSZWNlaXZlZCB6ZXJvIHN0b3JpZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICogRGVzaWduZXJOZXdzI3Byb2Nlc3NTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcHJvY2Vzc2VzIHJhdyBETiBzdG9yeSBkYXRhIGludG8gYSBzdHJpcHBlZCBkb3duIGFwaVxuICAgICAgKiBAcGFyYW0gOiBbIHsgc3RvcmllcyB9IF1cbiAgICAgICogQHBhcmFtIDogbGltaXRcbiAgICAgICogQGNhbGxzIDogY2IoW3sgdGl0bGUsIHVybCwgZG51cmwsIHVwdm90ZXMsIGF1dGhvciwgY29tbWVudENvdW50IH1dKVxuICAgICAqL1xuXG4gICAgRGVzaWduZXJOZXdzLnByb3RvdHlwZS5wcm9jZXNzU3RvcmllcyA9IGZ1bmN0aW9uKHN0b3JpZXMsIGNiKSB7XG4gICAgICB2YXIgcHJvY2Vzc2VkU3RvcmllcztcbiAgICAgIHByb2Nlc3NlZFN0b3JpZXMgPSBbXTtcbiAgICAgIHJldHVybiBfLmVhY2goc3RvcmllcywgZnVuY3Rpb24oc3RvcnksIGluZGV4KSB7XG4gICAgICAgIHZhciBwcm9jZXNzZWQ7XG4gICAgICAgIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgdXJsOiBzdG9yeS51cmwsXG4gICAgICAgICAgZG51cmw6IHN0b3J5LnNpdGVfdXJsLFxuICAgICAgICAgIHVwdm90ZXM6IHN0b3J5LnZvdGVfY291bnQsXG4gICAgICAgICAgYXV0aG9yOiBzdG9yeS51c2VyX2Rpc3BsYXlfbmFtZSxcbiAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmNvbW1lbnRzLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzZWRTdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSBzdG9yaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gY2IocHJvY2Vzc2VkU3Rvcmllcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVzaWduZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgRGVzaWduZXJOZXdzKGRuU2V0dGluZ3MuY2xpZW50X2lkLCBkblNldHRpbmdzLmNsaWVudF9zZWNyZXQsIGRuU2V0dGluZ3MucmVkaXJlY3RfdXJpLCBkblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgJCwgSGFja2VyTmV3cywgaG5TZXR0aW5ncywgXztcblxuICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBoblNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2V0dGluZ3MnKSkuaG47XG5cbiAgSGFja2VyTmV3cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBIYWNrZXJOZXdzKHJlZnJlc2hJbnRlcnZhbCkge1xuICAgICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSByZWZyZXNoSW50ZXJ2YWw7XG4gICAgICB0aGlzLmhuVXJpID0gJ2h0dHBzOi8vaGFja2VyLW5ld3MuZmlyZWJhc2Vpby5jb20vdjAnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgICogSGFja2VyTmV3cyNnZXRUb3BTdG9yaWVzXG4gICAgICAqIEBkZXNjIDogcmV0cmlldmVzIHRoZSB0b3Agc3RvcmllcyBmcm9tIEhhY2tlciBOZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCApXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRUb3BTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvdG9wc3Rvcmllcy5qc29uXCIsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHZhciBzdG9yeUlkcztcbiAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFJlY2VudFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiByZXRyaWV2ZXMgdGhlIGxhdGVzdCBzdHJlYW0gb2Ygc3RvcmllcyBmcm9tIGhhY2tlciBuZXdzXG4gICAgICAqIEBwYXJhbSA6IGxpbWl0IC0gbWF4IG51bWJlciBvZiBzdG9yaWVzIHRvIGdyYWJcbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRSZWNlbnRTdG9yaWVzID0gZnVuY3Rpb24obGltaXQsIGNiKSB7XG4gICAgICByZXR1cm4gJC5nZXRKU09OKFwiXCIgKyB0aGlzLmhuVXJpICsgXCIvbmV3c3Rvcmllcy5qc29uXCIsIHt9KS5kb25lKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHZhciBzdG9yeUlkcztcbiAgICAgICAgICBzdG9yeUlkcyA9IGRhdGEuc2xpY2UoMCwgbGltaXQpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdG9yaWVzKHN0b3J5SWRzLCBmdW5jdGlvbihlcnIsIHN0b3JpZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1JlY2VpdmVkIHplcm8gc3RvcmllcycpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBzdG9yaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5mYWlsKGZ1bmN0aW9uKHhociwgZXJyTXNnLCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgKiBIYWNrZXJOZXdzI2dldFN0b3JpZXNcbiAgICAgICogQGRlc2MgOiBnZXRzIHRoZSBzdG9yeSBjb250ZW50IGZvciBnaXZlbiBzdG9yeSBpZHNcbiAgICAgICogQHBhcmFtIDogW2lkc11cbiAgICAgICogQGNhbGxzIDogY2IoZXJyLCBbeyB0aXRsZSwgdXJsLCBzY29yZSwgYXV0aG9yLCBjb21tZW50Q291bnQgfV0pXG4gICAgICovXG5cbiAgICBIYWNrZXJOZXdzLnByb3RvdHlwZS5nZXRTdG9yaWVzID0gZnVuY3Rpb24oaWRzLCBjYikge1xuICAgICAgdmFyIGFqYXhFcnIsIHN0b3JpZXM7XG4gICAgICBzdG9yaWVzID0gW107XG4gICAgICBhamF4RXJyID0gbnVsbDtcbiAgICAgIHJldHVybiBfLmVhY2goaWRzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlkLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiAkLmdldEpTT04oXCJcIiArIF90aGlzLmhuVXJpICsgXCIvaXRlbS9cIiArIGlkICsgXCIuanNvblwiLCB7fSkuZG9uZShmdW5jdGlvbihzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGhudXJsLCBwcm9jZXNzZWQ7XG4gICAgICAgICAgICBobnVybCA9IF90aGlzLmdldEhOU3RvcnlVcmwoc3RvcnkuaWQpO1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0ge1xuICAgICAgICAgICAgICB0aXRsZTogc3RvcnkudGl0bGUsXG4gICAgICAgICAgICAgIHVybDogc3RvcnkudXJsID8gc3RvcnkudXJsIDogaG51cmwsXG4gICAgICAgICAgICAgIGhudXJsOiBobnVybCxcbiAgICAgICAgICAgICAgc2NvcmU6IHN0b3J5LnNjb3JlLFxuICAgICAgICAgICAgICBhdXRob3I6IHN0b3J5LmJ5LFxuICAgICAgICAgICAgICBjb21tZW50Q291bnQ6IHN0b3J5LmtpZHMgPyBzdG9yeS5raWRzLmxlbmd0aCA6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdG9yaWVzLnB1c2gocHJvY2Vzc2VkKTtcbiAgICAgICAgICAgIGlmIChzdG9yaWVzLmxlbmd0aCA9PT0gaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgc3Rvcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIGVyck1zZywgZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgSGFja2VyTmV3cy5wcm90b3R5cGUuZ2V0SE5TdG9yeVVybCA9IGZ1bmN0aW9uKHN0b3J5SWQpIHtcbiAgICAgIHJldHVybiBcImh0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20vaXRlbT9pZD1cIiArIHN0b3J5SWQ7XG4gICAgfTtcblxuICAgIHJldHVybiBIYWNrZXJOZXdzO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXcgSGFja2VyTmV3cyhoblNldHRpbmdzLnJlZnJlc2hfaW50ZXJ2YWxfbXMpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjguMFxuXG4vKlxuICAqIFB1YmxpYyBTZXR0aW5nc1xuICAqIEBkZXNjIDogdGhpcyBhIHB1YmxpYyB2ZXJzaW9uIG9mIHRoZSBzZXR0aW5ncyBmaWxlIHNob3dpbmcgaXQncyBzdHJ1Y3R1cmUsXG4gICogICAgICAgICBpdCBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCwgYW5kIEkgY2FuJ3QgcG9zdCBtaW5lIGFzIGl0IGNvbnRhaW5zXG4gICogICAgICAgICBBUEkga2V5cyBhbmQgY3JlZGVudGlhbHMhIFJlbmFtZSB0aGlzIHRvIHNldHRpbmdzLmNvZmZlZSBhbmRcbiAgKiAgICAgICAgIGZpbGwgaW4geW91ciBvd24gaW5mb3JtYXRpb24uXG4gICogQGF1dGhvciA6IFR5bGVyIEZvd2xlciA8dHlsZXJmb3dsZXIuMTMzN0BnbWFpbC5jb20+XG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgc2V0U2V0dGluZ3MsIHNldHRpbmdzS2V5TmFtZTtcblxuICBzZXR0aW5nc0tleU5hbWUgPSAnc2V0dGluZ3MnO1xuXG4gIHdpbmRvdy5yZXNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIHNldFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNldHRpbmdzO1xuICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2V0dGluZ3NLZXlOYW1lKSkge1xuICAgICAgc2V0dGluZ3MgPSB7XG5cbiAgICAgICAgLyogRGVzaWduZXIgTmV3cyBTZXR0aW5ncyAqL1xuICAgICAgICBkbjoge1xuICAgICAgICAgIHJlZnJlc2hfaW50ZXJ2YWxfbXM6IDE1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIGNsaWVudF9pZDogJzcyMzVhNWE1YTdkNzJhNDdmOTIxYjFlMGViMjFiMjEzZDIwOWUwZDM3NjFjNmEzYmNkM2QwMThkNmQzMWQyNmYnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICc4N2I0YTBhODg5N2Y0YWM2Y2RkNjE1Y2Q5OGI2NWNiYmYwZWI4MGFjOTQ5YmFmM2E0ZjI4MjZhOWIxNjMwY2Q3JyxcbiAgICAgICAgICByZWRpcmVjdF91cmk6ICd1cm46aWV0Zjp3ZzpvYXV0aDoyLjA6b29iJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIEhhY2tlciBOZXdzIFNldHRpbmdzICovXG4gICAgICAgIGhuOiB7XG4gICAgICAgICAgcmVmcmVzaF9pbnRlcnZhbF9tczogMTUgKiA2MCAqIDEwMDBcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzZXR0aW5nc0tleU5hbWUsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgfVxuICB9O1xuXG4gIHNldFNldHRpbmdzKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iXX0=
