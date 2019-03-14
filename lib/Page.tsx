import styled, { ThemeProvider } from 'lib/styled-components';
import React, { useState } from 'react';
import ClockPanel from './clock/ClockPanel';
import DNFeedPanel from './dn/DNFeedPanel';
import HNFeedPanel from './hn/HNFeedPanel';
import SettingsModal from './settings/components/Modal';
import { default as SettingsIcon } from './settings/components/OpenIcon';
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
  flex: 5 450px;
  overflow: hidden;
`;

const panelContainerStyles: React.CSSProperties = {
  flex: '4 200px',
  maxWidth: '750px',
};

const Page: React.FC = () => {
  const [ showSettings, setSettingsShowing ] = useState(false);

  return (
    <ThemeProvider theme={mainTheme}>
      <PageBackground>
        <DNFeedPanel panelOrientation="left" style={panelContainerStyles} />

        <CenterPane>
          <SettingsIcon
            onClick={() => setSettingsShowing(!showSettings)}
            style={{marginLeft: '1em', marginRight: '1em'}}
          />
          <ClockPanel />
        </CenterPane>

        <HNFeedPanel panelOrientation="right" style={panelContainerStyles} />

        <SettingsModal key="settings-modal" isOpen={showSettings}
          onClose={() => setSettingsShowing(false)}
        />
      </PageBackground>
    </ThemeProvider>
  );
};

export default Page;
