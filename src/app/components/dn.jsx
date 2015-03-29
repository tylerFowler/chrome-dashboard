var React = require('react');
var dn    = require('../model/dn_store');

DNList = React.createClass({
  getInitialState: function() {
    return { stories: [], err: null }
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
      this.loadDnStories(this.props.maxStories)
    }).bind(this), dn.refreshInterval);
  },

  // renderError: function(err) {
  //   return (
  //
  //   )
  // },

  render: function() {
    var dnlist = this.state.stories.map(function(story, index) {
      return (
        <DNItem storyId={index}
          title={story.title}
          url={story.url}
          dnurl={story.dnurl}
          upvotes={story.upvotes}
          author={story.author}
          commentCount={story.commentCount}
        />
      );
    });

    return (
      <div className="pane dn-container">
        <div className="pane-header dn-header">
          <span>Designer News</span>
        </div>

        <div className="story-list dnlist">
          {dnlist}
        </div>
      </div>
    );
  }
});

var DNItem = React.createClass({
  render: function() {
    var itemId = 'dnitem-' + this.props.storyId;

    // maybe do the index as a ::before element
    return (
      <div className="story-item dn-item" id={itemId}>

        <div className="story-index">
          <span>{this.props.storyId + 1}</span>
        </div>

        <div className="story-title">
          <a href={this.props.url} target="_blank">{this.props.title}</a>
        </div>

        <div className="story-metadata">
          <span className="story-upvotes">{this.props.upvotes}</span>
          <div className="upvote-icon"></div>

          <span className="story-author">{this.props.author}</span>
          <div className="story-data-divider"></div>

          <a className="story-comments" href={this.props.dnurl} target="_blank">
            {this.props.commentCount} comments
          </a>

        </div>
      </div>
    );
  }
});

module.exports = DNList;
