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
    // commented out for testing purposes only!
    // if (this.props.showTop === true)
    //   dn.getTopStories(limit, this.dnCb);
    // else
    //   dn.getRecentStories(limit, this.dnCb);
    this.setState({ stories: [], err: null });
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
      <div className="feed-loading-anim dn-loading">
      </div>
    );
  },

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

    var loading;
    if (dnlist.length === 0)
      loading = this.renderLoading();
    else
      loading = '';

    return (
      <div className="pane dn-container">
        <div className="pane-header dn-header">
          <h2>Designer News</h2>
        </div>

        <div className="story-list dnlist">
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
