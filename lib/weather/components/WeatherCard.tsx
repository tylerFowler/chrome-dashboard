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

const CurrentTemperature = styled.span`
  color: ${props => props.theme.typeDarkSemiLight};
  text-align: right;
  font-family: ${fontStacks.Montserrat};
  font-weight: normal;
  font-size: ${typeScale(10)};

  display: inline-block;
  width: 100%; // TODO: in the future we'll use flexbox

  &:after {
    content: '˚';
    position: relative;
    top: .05em;
    right: .075em;
  }
`;

const WeatherCard: React.SFC = () =>
  <WeatherCardContainer>
    <Location>KC</Location>

    <section>
      <CurrentTemperature>72</CurrentTemperature>
    </section>
  </WeatherCardContainer>
;

export default WeatherCard;
