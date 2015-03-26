var React = require('react');
var dn    = require('../model/dn_store');

// TODO: need a couple components here:
// - DNList : the overall list of items, simple wrapper w/ div structure
// - DNItem : each individual article, decorates the stories

var DNList = React.createClass({
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
    if (this.props.showTop === true)
      dn.getTopStories(limit, this.dnCb);
    else
      dn.getRecentStories(limit, this.dnCb);
  },

  componentDidMount: function() {
    this.loadDnStories(this.props.maxStories);
    setInterval(function() {this.loadDnStories}, dn.refreshInterval);
  }
})
