import styled from 'lib/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';

const DateText = styled.span`
  color: ${props => props.theme.typeDarkLight};
  font-family: ${fontStacks.OpenSans};
  font-size: ${typeScale(6)};
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
`;

const getLocaleMonth = (d: Date) => d.toLocaleString('en-us', { month: 'long' });

const DateDisplay: React.FunctionComponent<{date: Date}> = ({ date }) =>
  <div>
    <DateText>
      {getLocaleMonth(date)} {date.getDate().toString(10).padStart(2, '0')}
      , {date.getFullYear()}
    </DateText>
  </div>
;

export default DateDisplay;
