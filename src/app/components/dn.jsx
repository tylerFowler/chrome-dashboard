var React = require('react');
var dn    = require('../model/dn_store');

DNList = React.createClass({
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

  renderLoading: function() {
    return (
      <div className="feed-loading-anim dn-loading">
      </div>
    );
  },

  handleError: function(err) {
    return (
      <div className="feed-error dn-error">
        <div className="feed-error-icon"></div>
        <p className="error-msg">{err.toString()}</p>
      </div>
    );
  },

  render: function() {
    var error;
    if (this.state.err)
      error = this.handleError(this.state.err);
    else
      error = undefined;

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

    var loading;
    if (!error && dnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = '';

    return (
      <div className="pane dn-container">
        <div className="pane-header dn-header">
          <h2>Designer News</h2>
        </div>

        <div className="story-list dnlist">
          {error}
          {loading}
          {dnlist}
        </div>
      </div>
    );
  }
});

var DNItem = React.createClass({
  render: function() {
    var itemId = 'dnitem-' + this.props.storyId;
    var commentText = this.props.commentCount === 1 ? 'comment' : 'comments';

    // TODO: make it say 1 comment instead of 1 comments
    return (
      <div className="story-item dn-item" id={itemId}>

        <div className="story-index">
          <span>{this.props.storyId + 1}</span>
        </div>

        <div className="story-title">
          <a href={this.props.url} target="_blank">{this.props.title}</a>
        </div>

        <div className="story-metadata">
          <span className="story-upvotes">{this.props.upvotes} upvotes</span>
          <div className="upvote-icon"></div>

          <span className="story-author">{this.props.author}</span>
          <div className="story-data-divider"></div>

          <a className="story-comments" href={this.props.dnurl} target="_blank">
            {this.props.commentCount} {commentText}
          </a>

        </div>
      </div>
    );
  }
});

module.exports = DNList;
