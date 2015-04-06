var React = require('react');

var Bookmark = React.createClass({
  render: function() {
    return (
      <div className={"bookmark-card " + this.props.class}>

      </div>
    );
  }
});

module.exports = Bookmark;
