var React = require('react');
var hn    = require('../model/hn_store');

HNList = React.createClass({
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
      <div className="feed-loading-anim hn-loading">
      </div>
    );
  },

  handleError: function(err) {
    return (
      <div className="feed-error hn-error">
        <div className="feed-error-icon">
          <p className="error-msg">{err.toString()}</p>
        </div>
      </div>
    );
  },

  render: function() {
    var error;
    if (this.state.err)
      error = this.handleError(this.state.err);
    else
      error = undefined;

    var hnlist = this.state.stories.map(function(story, index) {
      return (
        <HNItem storyId={index}
          title={story.title}
          url={story.url}
          hnurl={story.hnurl}
          score={story.score}
          author={story.author}
          commentCount={story.commentCount}
        />
      );
    });

    var loading;
    if (!error && hnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = undefined;

    return (
      <div className="pane hn-container">
        <div className="pane-header hn-header">
          <h2>Hacker News</h2>
        </div>

        <div className="story-list hnlist">
          {error}
          {loading}
          {hnlist}
        </div>
      </div>
    );
  }
});

var HNItem = React.createClass({
  render: function() {
    var itemId = 'hnitem-' + this.props.storyId;
    var commentText = this.props.commentCount === 1 ? 'comment' : 'comments';

    return (
      <div className="story-item hn-item" id={itemId}>

        <div className="story-index">
          <span>{this.props.storyId + 1}</span>
        </div>

        <div className="story-title">
          <a href={this.props.url} target="_blank">{this.props.title}</a>
        </div>

        <div className="story-metadata">
          <span className="story-upvotes">{this.props.score} upvotes</span>
          <div className="upvote-icon"></div>

          <span className="story-author">{this.props.author}</span>
          <div className="story-data-divider"></div>

          <a className="story-comments" href={this.props.hnurl} target="_blank">
            {this.props.commentCount} {commentText}
          </a>

        </div>
      </div>
    );
  }
});

module.exports = HNList;
