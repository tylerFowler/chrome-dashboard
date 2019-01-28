import React from 'react';
import styled from '../styled-components';

const Container = styled.div`
  margin: auto;
  position: relative;
  top: 30%;

  text-align: center;
  line-height: 1.75;
`;

const ErrorIcon = styled.img`
  width: 30%;
  min-width: 75px;
  height: auto;

  display: block;
  margin: 0 auto 1em;
`;

const ErrorDisplay: React.FC = ({ children }) =>
  <Container>
    <ErrorIcon src="assets/connection-error.png" />

    {children}
  </Container>
;

export default ErrorDisplay;
