import styled, { ThemeProvider } from 'lib/styled-components';
import React from 'react';
import ClockPanel from './clock/ClockPanel';
import * as Styles from './styles';
import mainTheme from './theme';

const PageBackground = styled.div`
  width: 100%;
  height: 100%;

  font-size: ${Styles.fontSize};
  font-family: ${Styles.fontFamily};

  color: ${props => props.theme.typeDark};
  background-color: ${props => props.theme.backgroundLight};
`;

const Page: React.FunctionComponent = () =>
  <ThemeProvider theme={mainTheme}>
    <PageBackground>
      <ClockPanel />
    </PageBackground>
  </ThemeProvider>
;

export default Page;
