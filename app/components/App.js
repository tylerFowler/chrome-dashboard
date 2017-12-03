import React from 'react';
import ClockContainer from '../containers/ClockContainer';
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
`;

const MidSection = styled(BaseSection)`
  flex: 3.5;
`;

const RightSection = styled(BaseSection)`
  flex: 3;
`;

const App = () =>
  <div style={{display: 'flex', background: '#f0f0f0' }}>
    <LeftSection></LeftSection>

    <MidSection>
      <ClockContainer />
    </MidSection>

    <RightSection></RightSection>
  </div>
;

export default App;
