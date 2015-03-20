var React = require('react');
var dn    = require('../model/dn_store');

// TODO: need a couple components here:
// - DNList : the overall list of items, simple wrapper w/ div structure
// - DNItem : each individual article, decorates the stories

var DN = React.createClass({
  getInitialState: function() {
    return { stories: [] }
  },

  componentDidMount: function() {
    // See this for how to stop setInterval after it's started
    // http://stackoverflow.com/questions/1831152/how-to-stop-setinterval
    if (this.props.showTop === true) {
      // do call here to dn.topStories and figure out how to make the cb work
    }
  }
})
