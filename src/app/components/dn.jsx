var React = require('react');
var dn    = require('../model/dn_store');

// TODO: need a couple components here:
// - DNList : the overall list of items, simple wrapper w/ div structure
// - DNItem : each individual article, decorates the stories

var DNList = React.createClass({
  getInitialState: function() {
    return { stories: [], err: null }
  },

  componentDidMount: function() {
    // See this for how to stop setInterval after it's started
    // http://stackoverflow.com/questions/1831152/how-to-stop-setinterval
    if (this.props.showTop === true) {
      // do call here to dn.topStories and figure out how to make the cb work
      dn.getTopStories(this.props.maxStories, function(err, stories) {
        if (err) this.setState({ stories: [], err: err });
        else if (stories.length === 0) {
          this.setState({
            stories: [],
            err: new Error("we didn't get any stories!")
          });
        } else this.setState({ stories: stories, err: null });

      });
    } else {

    }
  }
})
