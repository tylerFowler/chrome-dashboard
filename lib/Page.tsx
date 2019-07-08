import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'lib/styled-components';
import * as Styles from './styles';
import mainTheme from './theme';
import BaseClockPanel from './clock/ClockPanel';
import SettingsModal from './settings/components/Modal';
import SettingsIcon, { FloatingOpenIcon as FloatingSettingsIcon } from './settings/components/OpenIcon';
import BaseDashboardPanel from './DashboardPanel';
import WeatherPanel from './weather/components/WeatherPanel';
import { WeatherSettingsProvider } from './settings/context';

enum LayoutBreakpoint {
  XL = 1350,
  S = 750,
}

const PageBackground = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  font-size: ${Styles.fontSize};
  font-family: ${Styles.fontFamily};

  color: ${props => props.theme.typeDark};
  background-color: ${props => props.theme.backgroundLight};
`;

const CenterPane = styled.section`
  flex: 5 450px;
  overflow: hidden;
`;

const TopPane = styled.section`
  width: 100%;
  flex-basis: 100%;
  padding-bottom: 5vh;

  @media (max-width: ${LayoutBreakpoint.S}px) {
    padding-bottom: 0;
  }
`;

const CenterControls = styled.section`
  padding: 1em;
`;

const ClockPanel = styled(BaseClockPanel)`
  @media (max-width: ${LayoutBreakpoint.S}px) {
    min-width: unset;
    width: auto;
    padding: 1em .5em;
    zoom: .9;

    border-left: none;
    border-right: none;
  }

  @media (max-width: 375px) { zoom: .8; }
  @media (max-width: 325px) { zoom: .75; }
`;

const DashboardPanel = styled(BaseDashboardPanel)`
  flex: 4 200px;
  max-width: 750px;
`;

interface BreakpointConfig {
  XL: number;
  M: number;
  S: number;
}

// TODO: it might be worthwhile to activate this at the very top level and send
// its value down in a context var so that anything can react to it, allowing the
// AtSizes component to not have to take in a breakpoint
function useBreakpoint(breakpoints: BreakpointConfig): keyof BreakpointConfig {
  const lgMql = window.matchMedia(`(min-width: ${breakpoints.XL}px)`);
  const medMql = window.matchMedia(`(max-width: ${breakpoints.XL}px) and (min-width: ${breakpoints.M}px)`);
  const smMql = window.matchMedia(`(max-width: ${breakpoints.S}px)`);

  let defaultValue: keyof BreakpointConfig = 'XL';
  if (lgMql.matches) {
    defaultValue = 'XL';
  }

  if (medMql.matches) {
    defaultValue = 'M';
  }

  if (smMql.matches) {
    defaultValue = 'S';
  }

  const [ breakpoint, setBreakpoint ] = useState<keyof BreakpointConfig>(defaultValue);

  useEffect(() => {
    const handler = (size: keyof BreakpointConfig) => (event: MediaQueryListEvent) => {
      if (event.matches) {
        setBreakpoint(size);
      }
    };

    const xlHandler = handler('XL');
    lgMql.addListener(xlHandler);

    const medHandler = handler('M');
    medMql.addListener(medHandler);

    const smHandler = handler('S');
    smMql.addListener(smHandler);

    return () => {
      lgMql.removeListener(xlHandler);
      medMql.removeListener(medHandler);
      smMql.removeListener(smHandler);
    };
  });

  return breakpoint;
}

const AtSizes: React.FC<{
  readonly breakpoints: Array<keyof BreakpointConfig>;
  readonly breakpoint: keyof BreakpointConfig;
}> = ({ breakpoints = [], breakpoint, children }) => {
  const display = breakpoints.find(bp => bp === breakpoint)
    ? 'contents' // don't affect the layout at all, making this a visual no-op
    : 'none';    // don't show the element at all but allow React to keep it rendered

  return <span style={{display}}>{children}</span>;
};

// TODO: increase panel size to lower the threshold for going to med layout
// TODO: wrap the display rules in custom container components that hide or show things
const Page: React.FC = () => {
  const [ showSettings, setSettingsShowing ] = useState(false);
  const onSettingsClick = () => setSettingsShowing(isShowing => !isShowing);

  const breakpoint = useBreakpoint({ XL: LayoutBreakpoint.XL, M: LayoutBreakpoint.S, S: LayoutBreakpoint.S });

  return (
    <ThemeProvider theme={mainTheme}>
      <PageBackground>
        <AtSizes breakpoint={breakpoint} breakpoints={[ 'S', 'M' ]}>
          <TopPane>
            <FloatingSettingsIcon onClick={onSettingsClick} />
            <ClockPanel />
          </TopPane>
        </AtSizes>

        <AtSizes breakpoint={breakpoint} breakpoints={[ 'XL', 'M' ]}>
          <DashboardPanel orientation="left" />
        </AtSizes>

        <AtSizes breakpoint={breakpoint} breakpoints={[ 'XL' ]}>
          <CenterPane style={{display: breakpoint !== 'XL' ? 'none' : 'unset'}}>
            <SettingsIcon onClick={onSettingsClick} style={{marginLeft: '1em', marginRight: '1em'}} />
            <ClockPanel />

            <CenterControls>
              <WeatherSettingsProvider>
                <WeatherPanel />
              </WeatherSettingsProvider>
            </CenterControls>
          </CenterPane>
        </AtSizes>

        <DashboardPanel orientation="right" />

        <SettingsModal key="settings-modal" isOpen={showSettings}
          onClose={() => setSettingsShowing(false)}
        />
      </PageBackground>
    </ThemeProvider>
  );
};

export default Page;
