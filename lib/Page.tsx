import styled, { ThemeProvider } from 'lib/styled-components';
import React from 'react';
import ClockPanel from './clock/ClockPanel';
import Panel from './panel/components/Panel';
import * as Styles from './styles';
import mainTheme from './theme';

const PageBackground = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  font-size: ${Styles.fontSize};
  font-family: ${Styles.fontFamily};

  color: ${props => props.theme.typeDark};
  background-color: ${props => props.theme.backgroundLight};
`;

const CenterPane = styled.section`
  flex: 8 450px;
  overflow: hidden;
`;

const panelContainerStyles: React.CSSProperties = {
  flex: '6 200px',
};

const Page: React.FunctionComponent = () =>
  <ThemeProvider theme={mainTheme}>
    <PageBackground>
      <Panel title="Left Panel" panelOrientation="left" style={panelContainerStyles} />

      <CenterPane>
        <ClockPanel />
      </CenterPane>

      <Panel title="Right Panel" panelOrientation="right" style={panelContainerStyles} />
    </PageBackground>
  </ThemeProvider>
;

export default Page;
