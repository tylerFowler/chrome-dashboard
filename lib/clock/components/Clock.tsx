import styled from 'lib/styled-components';
import React from 'react';
import DateDisplay from './Date';
import Time from './Time';

export interface ClockProps {
  date: Date;
}

const Panel = styled.div`
  background-color: #fff;
  border: 3px solid #4f4f4f;
  text-align: center;

  padding: 0 .5em;
  margin: 0 auto;
  margin-top: -3px; /* pull up off the page */
  min-height: 175px;
  width: 450px;
  min-width: 425px;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 5px dashed ${props => props.theme.borderDarkLight};
  width: 75%;
  margin: 1rem auto;
`;

export default class Clock extends React.Component<ClockProps> {
  public render() {
    return (
      <Panel>
        <Time date={this.props.date} />
        <Divider />
        <DateDisplay date={this.props.date} />
      </Panel>
    );
  }
}
