import React, { useState } from 'react';
import styled, { ThemeProvider } from 'lib/styled-components';
import * as Styles from './styles';
import mainTheme from './theme';
import BaseClockPanel from './clock/ClockPanel';
import SettingsModal from './settings/components/Modal';
import SettingsIcon, { FloatingOpenIcon as FloatingSettingsIcon } from './settings/components/OpenIcon';
import WeatherPanel from './weather/components/WeatherPanel';
import { WeatherSettingsProvider } from './settings/context';
import BaseDashboardPanel from './DashboardPanel';
import PrimaryPanelPicker from './PrimaryPanelPicker';
import { useBreakpoint, BreakpointContext, AtSizes } from './Breakpoint';

// layout breakpoint thresholds in pixels
enum LayoutBreakpoint {
  XL = 1440,
  L = 1225,
  S = 750,
}

const PageBackground = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  place-content: flex-start;

  font-size: ${Styles.fontSize};
  font-family: ${Styles.fontFamily};

  color: ${props => props.theme.typeDark};
  background-color: ${props => props.theme.backgroundLight};
`;

const CenterPane = styled.section`
  flex: 5 350px;
  overflow: hidden;
`;

const TopPane = styled.section`
  width: 100%;
  flex-basis: 100%;
  padding-bottom: 5vh;
  background-color: ${props => props.theme.backgroundExtraLight};
  border-bottom: 2px solid ${props => props.theme.borderDark};

  @media (max-width: ${LayoutBreakpoint.S}px) {
    padding-bottom: 0;
  }
`;

const CenterControls = styled.section`
  padding: 1em;
`;

const ClockPanel = styled(BaseClockPanel)`
  width: 75%;

  @media (max-width: ${LayoutBreakpoint.S}px) {
    min-width: unset;
    max-width: unset;
    width: auto;
    padding: 1em .5em;
    zoom: .9;

    border: none;
  }

  @media (max-width: 375px) { zoom: .8; }
  @media (max-width: 325px) { zoom: .75; }
`;

const DashboardPanel = styled(BaseDashboardPanel)`
  flex: 4 275px;
  max-width: 750px;

  @media (max-width: ${LayoutBreakpoint.XL}px) and (min-width: ${LayoutBreakpoint.L}px) {
    flex-basis: 15%;
  }

  @media (max-width: ${LayoutBreakpoint.S}px) {
    height: auto;
  }
`;

const Page: React.FC = () => {
  const [ showSettings, setSettingsShowing ] = useState(false);
  const [ singleColPanel, setSingleColPanel ] = useState<'left'|'right'>('right');

  const onSettingsClick = () => setSettingsShowing(isShowing => !isShowing);
  const breakpoint = useBreakpoint({ L: LayoutBreakpoint.L, M: LayoutBreakpoint.S, S: LayoutBreakpoint.S });

  return (
    <ThemeProvider theme={mainTheme}>
    <BreakpointContext.Provider value={breakpoint}>
      <PageBackground>
        <AtSizes breakpoints={['S', 'M']}>
          <TopPane>
            <FloatingSettingsIcon onClick={onSettingsClick} style={{marginLeft: '5%'}} />
            <ClockPanel />

            <AtSizes breakpoints={['S']}>
              <PrimaryPanelPicker panel={singleColPanel} onChange={setSingleColPanel} />
            </AtSizes>
          </TopPane>
        </AtSizes>

        <AtSizes breakpoints={['L', 'M']}>
          <DashboardPanel orientation="left" />
        </AtSizes>

        <AtSizes breakpoints={['L']}>
          <CenterPane>
            <SettingsIcon onClick={onSettingsClick} style={{marginLeft: '.5%'}} />
            <ClockPanel />

            <CenterControls>
              <WeatherSettingsProvider>
                <WeatherPanel />
              </WeatherSettingsProvider>
            </CenterControls>
          </CenterPane>
        </AtSizes>

        <DashboardPanel orientation={breakpoint === 'S' ? singleColPanel : 'right'} />

        <SettingsModal key="settings-modal" isOpen={showSettings}
          onClose={() => setSettingsShowing(false)}
        />
      </PageBackground>
    </BreakpointContext.Provider>
    </ThemeProvider>
  );
};

export default Page;
