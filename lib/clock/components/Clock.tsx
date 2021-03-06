import styled from 'lib/styled-components';
import React from 'react';
import DateDisplay from './Date';
import Time from './Time';

export interface ClockProps {
  readonly date: Date;
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const Panel = styled.div`
  user-select: none;
  background-color: ${props => props.theme.backgroundExtraLight};
  border: 3px solid ${props => props.theme.borderDark};
  text-align: center;

  padding: 0 .5em;
  margin: 0 auto;
  margin-top: -3px; /* pull up off the page */
  min-height: 175px;
  min-width: 425px;
  max-width: 450px;
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
      <Panel style={this.props.style} className={this.props.className}>
        <Time date={this.props.date} />
        <Divider />
        <DateDisplay date={this.props.date} />
      </Panel>
    );
  }
}
