import React from 'react';
import styled from 'styled-components';
import { fontStacks, typeScale } from '../../styles';

export interface TimeProps {
  readonly date: Date;
  readonly twelveHour?: boolean;
}

const Container = styled.div`
  font-family: ${fontStacks.Montserrat};
`;

const TimeText = styled.span`
  font-size: ${typeScale(12)};
  font-weight: bold;
  letter-spacing: 12px;
  line-height: .965;
`;

const Period = styled.span`
  font-size: ${typeScale(6, 'px')};

  position: absolute; /* take out of flow to center the time */
  display: inline-block;
  vertical-align: top;
  margin-top: .9em;
  line-height: 0;
`;

export default class Time extends React.Component<TimeProps> {
  public static defaultProps: Pick<TimeProps, 'twelveHour'> = {
    twelveHour: true,
  };

  public getFormattedTime(): { hours: number, minutes: number } {
    const { date, twelveHour } = this.props;
    return {
      hours: twelveHour && date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
      minutes: date.getMinutes(),
    };
  }

  public getPeriod(): 'am'|'pm' {
    return this.props.date.getHours() > 12 ? 'pm' : 'am';
  }

  public render() {
    const time = this.getFormattedTime();
    const fmtPart = (part: number) => part.toString(10).padStart(2, '0');

    return (
      <Container>
        <TimeText>
          {fmtPart(time.hours)}:{fmtPart(time.minutes)}
        </TimeText>
        <Period>{this.getPeriod().toUpperCase()}</Period>
      </Container>
    );
  }
}
