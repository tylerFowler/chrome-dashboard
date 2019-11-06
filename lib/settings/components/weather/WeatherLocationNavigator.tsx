import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Spinner from 'lib/styled/Spinner';
import * as selector from '../../selectors';
import { refreshWeatherCoords } from '../../actions';

const NavigatorIcon = styled.img.attrs({
  src: '/assets/geolocation.svg',
})`
  cursor: pointer;
  opacity: .75;
  width: 1.5em;
  height: 1.5em;

  float: right;
  padding: .25em;
`;

const ForwardedWeatherLocationNavigator = React.forwardRef<HTMLImageElement>(
  function WeatherLocationNavigator(_, ref) {
    const dispatch = useDispatch();
    const refreshing = useSelector(selector.isRefreshingWeatherLocation);

    if (refreshing) {
      return <Spinner ref={ref} />;
    }

    return <NavigatorIcon ref={ref}
      title="Update your location" alt="Update your location"
      onClick={() => dispatch(refreshWeatherCoords())}
    />;
  },
);

export default ForwardedWeatherLocationNavigator;
