import React, { useEffect, useContext } from 'react';
import styled from 'lib/styled-components';
import { fontStacks, typeScale } from 'lib/styles';
import { Error as ErrorAlert } from 'lib/styled/Alert';
import WeatherConditionIcon from './WeatherConditionIcon';
import { WeatherConditionType, WeatherLocation } from '../interface';
import { WeatherSettingsContext } from '../../settings/context';
import SizeAdjustedLocation from './SizeAdjustedLocation';

export interface WeatherCardProps {
  readonly location?: string;
  readonly currentWeatherType?: WeatherConditionType;
  readonly currentTemperature?: number|string;
  readonly futurePeriod?: 'Tonight'|'Tomorrow';
  readonly futureWeatherType?: WeatherConditionType;
  readonly futureTemperature?: number|string;
  readonly forecastFetchError?: Error;

  fetchForecast?(location: WeatherLocation, unit: 'F'|'C'): void;
  refineLocation?(): void;
}

export const WeatherCardContainer = styled.section`
  background: ${props => props.theme.backgroundExtraLight};

  padding: .75em 5% 1em;
  margin: 1em auto;
  overflow: hidden;

  width: 40%;
  min-width: 300px;
  min-height: 10rem;
`;

const NavigatorIcon = styled.img.attrs({
  src: '/assets/geolocation.svg',
})`
  cursor: pointer;
  opacity: .75;
  width: 1.5em;
  height: 1.5em;

  float: right;
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

const FutureTemperature = styled(Temperature)`
  font-family: ${fontStacks.Montserrat};
  color: ${props => props.theme.typeDarkLight};
`;

const WeatherCard: React.SFC<WeatherCardProps> = ({
  location, fetchForecast, refineLocation,
  currentWeatherType, currentTemperature,
  futurePeriod, futureWeatherType, futureTemperature,
  forecastFetchError,
}) => {
  const weatherSettings = useContext(WeatherSettingsContext);

  useEffect(() =>
    fetchForecast(weatherSettings.location, weatherSettings.unit)
  , [ weatherSettings.location && weatherSettings.location.value, weatherSettings.unit ]);

  return (
    <WeatherCardContainer>
      {refineLocation && <NavigatorIcon title="Update your location" alt="Update your location"
          onClick={refineLocation}
        />
      }

      {forecastFetchError &&
        <ErrorAlert style={{textAlign: 'center'}}>{forecastFetchError.message}</ErrorAlert>
      }

      <SizeAdjustedLocation>{location}</SizeAdjustedLocation>

      <TempSection style={{fontSize: typeScale(9), padding: '0 13%'}}>
        <WeatherConditionIcon type={currentWeatherType} style={{flex: 1}} />
        <CurrentTemperature>{currentTemperature}</CurrentTemperature>
      </TempSection>

      <TempSection style={{fontSize: typeScale(6)}}>
        <span style={{fontFamily: fontStacks.OpenSans, fontWeight: 'bold'}}>
          {futurePeriod}:
        </span>

        <span>
          <WeatherConditionIcon type={futureWeatherType} size="1.25em"
            style={{
              flex: 1, verticalAlign: 'middle', marginRight: '.25em',
              position: 'relative', bottom: 'calc(.25em / 2)',
            }}
          />

          <FutureTemperature>{futureTemperature}</FutureTemperature>
        </span>
      </TempSection>
    </WeatherCardContainer>
  );
};

WeatherCard.defaultProps = {
  location: '…',
  currentTemperature: '∞',
  futurePeriod: 'Tonight',
  futureTemperature: '∞',
  fetchForecast() {},
};

export default WeatherCard;
