var React = require('react');
var $     = require('jquery');

var Bookmark = React.createClass({
  click: function() {
    // when the container is clicked, forward it to the <a> hyperlink
    $('.' + this.props.class).click(function() {
      $(this).children('a').trigger('click');
    });
  },

  render: function() {
    return (
      <div id={this.props.bookmarkId}
        className={"bookmark-card " + this.props.customClass}
        onclick={this.click}>

        <div className="bookmark-logo"></div>
        <a href={this.props.link} className="hidden"></a>
      </div>
    );
  }
});

module.exports = Bookmark;
