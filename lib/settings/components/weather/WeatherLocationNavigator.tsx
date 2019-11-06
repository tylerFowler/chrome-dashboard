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

  width: 100%;
  height: 100%;
`;

const IconContainer = styled.div`
  width: 1.5em;
  height: 1.5em;
  padding: .25em;
`;

const ForwardedWeatherLocationNavigator = React.forwardRef<HTMLDivElement, { readonly style?: React.CSSProperties }>(
  function WeatherLocationNavigator({ style }, ref) {
    const dispatch = useDispatch();
    const refreshing = useSelector(selector.isRefreshingWeatherLocation);

    return (
      <IconContainer ref={ref} style={style}>
        {refreshing
          ? <Spinner />
          : <NavigatorIcon
            title="Update your location" alt="Update your location"
            onClick={() => dispatch(refreshWeatherCoords())}
          />
        }
      </IconContainer>
    );
  },
);

export default ForwardedWeatherLocationNavigator;
