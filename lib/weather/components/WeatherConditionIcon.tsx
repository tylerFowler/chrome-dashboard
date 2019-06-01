import React from 'react';
import styled from 'styled-components';
import { WeatherConditionType } from '../interface';

export interface WeatherConditionIconProps {
  readonly type: WeatherConditionType;
  readonly size?: string;
  readonly style?: React.CSSProperties;
}

const assetIconMap: { readonly [P in WeatherConditionType]: string } = {
  clearDay: '/assets/clear-day.svg',
  clearNight: '/assets/clear-night.svg',
  cloudy: '/assets/cloudy.svg',
  partlyCloudyDay: '/assets/partly-cloudy-day.svg',
  partlyCloudyNight: '/assets/partly-cloudy-night.svg',
  partialMoon: '/assets/partial-moon.svg',
  cloudyPartialMoon: '/assets/cloudy-partial-moon.svg',
  rain: '/assets/rain.svg',
  heavyRain: '/assets/heavy-rain.svg',
  thunderstorm: '/assets/thunderstorm.svg',
  partlySunnyRain: '/assets/partly-sunny-with-rain.svg',
  partlyMoonyRain: '/assets/partly-moony-with-rain.svg',
  snow: '/assets/snow.svg',
  heavySnow: '/assets/heavy-snow.svg',
  wind: '/assets/wind.svg',
  unknown: '/assets/unknown.svg',
};

const WeatherIconImg = styled('img')<{ readonly size?: string }>`
  width: ${props => props.size};
  max-width: ${props => props.size};
  height: ${props => props.size};
  max-height: ${props => props.size};
`;

WeatherIconImg.defaultProps = { size: '1em' };

const WeatherConditionIcon: React.SFC<WeatherConditionIconProps> = ({ type, size, style }) =>
  <WeatherIconImg size={size} src={assetIconMap[type]} style={style} />
;

export default WeatherConditionIcon;
