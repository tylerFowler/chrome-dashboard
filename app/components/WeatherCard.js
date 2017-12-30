import React, { Component } from 'react';
import Card from './styled/Card';
import styled from 'styled-components';

const WeatherContainer = styled(Card)`
  margin: 25% 2em;
`;

export default class WeatherCard extends Component {
  constructor(props) { super(props); }

  render() {
    return (
      <WeatherContainer>
        Here be the weather
      </WeatherContainer>
    );
  }
}
