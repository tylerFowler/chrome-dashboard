import React from 'react';
import styled from 'styled-components';

const PageBackground = styled.div`
  background-color: #f0f0f0;
`;

const Page: React.FunctionComponent = () =>
  <PageBackground>
    Hello World
  </PageBackground>
;

export default Page;
