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
  max-width: 100px;
  height: auto;

  background: ${props => props.theme.backgroundExtraLight};
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderDarkLight};
  padding: .75em;

  display: block;
  margin: 0 auto 1em;
`;

const ErrorDisplay: React.FC = ({ children }) =>
  <Container>
    <ErrorIcon src="assets/rain.svg" />

    {children}
  </Container>
;

export default ErrorDisplay;
