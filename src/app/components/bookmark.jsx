var React = require('react');
var $     = require('jquery');

var BookmarkList = React.createClass({
  // this class doesn't actually do anything, it's just a wrapper to simplify
  // the main view markup
  render: function() {
    return (
      <div className="bookmark-container">
        { /* Note that the bookmarks are laid out by id number */ }

        <Bookmark bookmarkId="bookmark-1" customClass="bookmark-flipboard"
          link="https://flipboard.com/" />

        <Bookmark bookmarkId="bookmark-2" customClass="bookmark-simple"
          link="https://bank.simple.com/" />

        <Bookmark bookmarkId="bookmark-3" customClass="bookmark-newyorker"
          link="http://www.newyorker.com/" />

        <Bookmark bookmarkId="bookmark-4" customClass="bookmark-qz"
          link="http://qz.com/" />
      </div>
    );
  }
});

var Bookmark = React.createClass({
  render: function() {
    return (
      <a href={this.props.link} target="_blank" id={this.props.bookmarkId}
        className={"bookmark-card " + this.props.customClass}>

        <div className="bookmark-logo"></div>
      </a>
    );
  }
});

module.exports = BookmarkList;
