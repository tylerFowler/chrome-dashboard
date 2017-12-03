import React, { Component } from 'react';

export default class Clock extends Component {
  constructor(props) { super(props); }

  render() {
    const { time, date } = this.props;

    return (
      <div>
        <div>
          <h1>{time.hour}:{time.minute}</h1>
          <span>{time.modifier}</span>
        </div>

        <hr />

        <div>
          <h2>{date.month} {date.day}, {date.year}</h2>
        </div>
      </div>
    );
  }
}
