var React = require('react');
var dn    = require('../model/dn_store');

// TODO: need a couple components here:
// - DNList : the overall list of items, simple wrapper w/ div structure
// - DNItem : each individual article, decorates the stories

DNList = React.createClass({
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

    console.dir(dnlist);

    return (
      <div className="dn-container">
        <div className="dn-header component-header">
          <span>Designer News</span>
        </div>

        <div className="dnlist">
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
      <div className="dn-item article-item" id={itemId}>

        <div className="article-index">
          <span>{this.props.storyId + 1}</span>
        </div>

        <div className="article-title">
          <a href={this.props.url}>{this.props.title}</a>
        </div>

        <div className="article-metadata">
          <span className="article-upvote">{this.props.upvotes}</span>
          <div className="upvote-icon"></div>

          <span className="article-author">{this.props.author}</span>
          <div className="article-data-divider"></div>

          <a className="article-comments" href={this.props.dnurl}>
            {this.props.commentCount} comments
          </a>

        </div>
      </div>
    );
  }
});

module.exports = DNList;
