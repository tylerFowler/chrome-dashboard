import React, { Component } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  width: 75%;
  max-width: 400px;
  min-width: 350px;
  height: 9em;
  display: block;
  margin: -3px auto;
  border: 3px solid #4f4f4f;
  background: #ffffff;

  text-align: center;
  color: #404040;
`;

const TimeContainer = styled.div`
  font-family: Montserrat, sans-serif;
`;

const Time = styled.h1`
  font-size: 4.5rem;
  display: inline-block;
  margin: 0;
  margin-left: .75em;
  letter-spacing: .1em;
`;

const TimePeriod = styled.span`
  vertical-align: top;
  display: inline-block;
  font-size: 2rem;

  position: relative;
  top: .5em;
`;

const ClockDivider = styled.div`
  width: 60%;
  height: 0;
  margin: 0 auto;

  background: none;
  border-bottom: 3px dashed #767676;
`;

const ClockDate = styled.h2`
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  font-weight: 200;
  text-transform: uppercase;
  margin: .5em auto;
  letter-spacing: 4px;
`;

export default class Clock extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.ticker();
    const tickInterval = setInterval(() => { this.props.ticker(); }, 60 * 1000);

    this.setState(prevState => {
      if (prevState && prevState.tickInterval) clearInterval(prevState.tickInterval);
      return { tickInterval };
    });
  }

  comonentWillUnmount() {
    if (this.state.tickInterval) clearInterval(this.state.tickInterval);
  }

  render() {
    const { useTwelveHourClock, time, date } = this.props;
    const clockHour = useTwelveHourClock && time.hour > 12 ? time.hour - 12 : time.hour;

    return (
      <ClockContainer>
        <TimeContainer>
          <Time>{clockHour}:{time.minute}</Time>
          <TimePeriod>{time.period}</TimePeriod>
        </TimeContainer>

        <ClockDivider />

        <div>
          <ClockDate>{date.month} {date.day}, {date.year}</ClockDate>
        </div>
      </ClockContainer>
    );
  }
}
