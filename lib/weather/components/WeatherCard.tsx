import React from 'react';
import styled from 'lib/styled-components';
import { fontStacks, typeScale } from 'lib/styles';
import WeatherConditionIcon from './WeatherConditionIcon';
import { WeatherConditionType } from '../interface';

const WeatherCardContainer = styled.section`
  background: ${props => props.theme.backgroundExtraLight};

  padding: .75em 5% 1em;
  margin: 1em auto;
  overflow: hidden;

  width: 40%;
  min-width: 350px;
  min-height: 10rem;
`;

const Location = styled.h1`
  text-align: center;
  font-family: ${fontStacks.OpenSans};
  font-weight: 200;

  margin: 0 auto 1rem;
`;

const Temperature = styled.span`
  font-family: ${fontStacks.Montserrat};
  font-weight: normal;

  // this font tends to sit the degree symbol a bit high
  &:after {
    content: '˚';
    position: relative;
    top: .05em;
    right: .075em;
  }
`;

const TempSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: .35em auto;

  &:last-of-type { margin-bottom: 0; }
`;

const CurrentTemperature = styled(Temperature)`
  color: ${props => props.theme.typeDarkSemiLight};
  text-align: right;
  font-size: 1em;

  flex: 3;
  flex-grow: 3;
`;

const FutureWeatherTemp = styled(Temperature)`
  font-family: ${fontStacks.Montserrat};
  color: ${props => props.theme.typeDarkLight};
`;

const WeatherCard: React.SFC = () =>
  <WeatherCardContainer>
    <Location style={{fontSize: typeScale(10)}}>KC</Location>

    <TempSection style={{fontSize: typeScale(10), padding: '0 13%'}}>
      <WeatherConditionIcon type="unknown" style={{flex: 1}} />
      <CurrentTemperature>72</CurrentTemperature>
    </TempSection>

    <TempSection style={{fontSize: typeScale(7)}}>
      <span style={{fontFamily: fontStacks.OpenSans, fontWeight: 'bold'}}>Tonight:</span>

      <span>
        <WeatherConditionIcon type="rain" size="1.25em"
          style={{
            flex: 1, verticalAlign: 'middle', marginRight: '.25em',
            position: 'relative', bottom: 'calc(.25em / 2)',
          }}
        />

        <FutureWeatherTemp>64</FutureWeatherTemp>
      </span>
    </TempSection>
  </WeatherCardContainer>
;

export default WeatherCard;
