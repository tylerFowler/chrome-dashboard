import React from 'react';
import ClockContainer from '../containers/ClockContainer';
import WeatherCardContainer from '../containers/WeatherCardContainer';
import styled from 'styled-components';

const BaseSection = styled.div`
  display: flex;
  outline: 1px solid black;
  flex: 1;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 0 5px;
  height: 100vh;
`;

const LeftSection = styled(BaseSection)`
  flex: 3;
  margin-left: 0;
`;

const MidSection = styled(BaseSection)`
  flex: 3.5;
`;

const RightSection = styled(BaseSection)`
  flex: 3;
  margin-right: 0;
`;

const App = () =>
  <div style={{display: 'flex', background: '#f0f0f0' }}>
    <LeftSection></LeftSection>

    <MidSection>
      <ClockContainer />
      <WeatherCardContainer />
    </MidSection>

    <RightSection></RightSection>
  </div>
;

export default App;
