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

  render: function() {
    return (
      <span>Stories Count: {this.state.stories.length}</span>
    );
  }
});

module.exports = DNList;
