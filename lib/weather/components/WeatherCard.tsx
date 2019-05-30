import React from 'react';
import styled from 'lib/styled-components';
import { fontStacks, typeScale } from 'lib/styles';

const WeatherCardContainer = styled.section`
  background: ${props => props.theme.backgroundExtraLight};

  padding: 1.5em 1em;
  margin: 1em auto;
  overflow: hidden;

  width: 40%;
  min-width: 350px;
  min-height: 10rem;
`;

const Location = styled.h1`
  text-align: center;
  font-family: ${fontStacks.OpenSans};
  font-weight: normal;
  font-size: ${typeScale(11)};

  margin: 0 auto 1rem;
`;

const CurrentTempSection = styled.section`
  display: flex;
  align-items: center;
  font-size: ${typeScale(10)};
`;

const CurrentTemperature = styled.span`
  color: ${props => props.theme.typeDarkSemiLight};
  text-align: right;
  font-size: 1em;
  font-family: ${fontStacks.Montserrat};
  font-weight: normal;

  flex: 3;
  flex-grow: 3;

  &:after {
    content: '˚';
    position: relative;
    top: .05em;
    right: .075em;
  }
`;

const PlaceholderIcon = styled('div')<{ size?: string }>`
  border: 3px solid #646464;
  display: inline-block;
  flex: 1;

  width: ${props => props.size};
  max-width: ${props => props.size};
  height: ${props => props.size};
  max-height: ${props => props.size};
`;

PlaceholderIcon.defaultProps = { size: '1em' };

const WeatherCard: React.SFC = () =>
  <WeatherCardContainer>
    <Location>KC</Location>

    <CurrentTempSection>
      <PlaceholderIcon />
      <CurrentTemperature>72</CurrentTemperature>
    </CurrentTempSection>
  </WeatherCardContainer>
;

export default WeatherCard;
