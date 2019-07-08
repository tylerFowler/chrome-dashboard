import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled, { ThemeProvider } from 'lib/styled-components';
import * as Styles from './styles';
import mainTheme from './theme';
import BaseClockPanel from './clock/ClockPanel';
import SettingsModal from './settings/components/Modal';
import SettingsIcon, { FloatingOpenIcon as FloatingSettingsIcon } from './settings/components/OpenIcon';
import DashboardPanel from './DashboardPanel';
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

const CenterControls = styled.section`
  padding: 1em;
`;

const panelContainerStyles: React.CSSProperties = {
  flex: '4 200px',
  maxWidth: '750px',
};

const LeftDashPanel = () => <DashboardPanel orientation="left" style={panelContainerStyles} />;
const RightDashPanel = () => <DashboardPanel orientation="right" style={panelContainerStyles} />;

interface LayoutProps {
  onSettingsClick(): void;
}

const LargeLayout: React.FC<LayoutProps> = ({ onSettingsClick }) => <>
  <LeftDashPanel />

  <CenterPane>
    <SettingsIcon onClick={onSettingsClick} style={{marginLeft: '1em', marginRight: '1em'}} />
    <ClockPanel />

    <CenterControls>
      <WeatherSettingsProvider>
        <WeatherPanel />
      </WeatherSettingsProvider>
    </CenterControls>
  </CenterPane>

  <RightDashPanel />
</>;

const MedLayout: React.FC<LayoutProps> = ({ onSettingsClick }) => <>
  <TopPane>
    <SettingsIcon onClick={onSettingsClick} style={{marginLeft: '1em'}} />
    <ClockPanel />
  </TopPane>

  <LeftDashPanel />
  <RightDashPanel />
</>;

// TODO: replace right panel usage with a "primary" feed, add a selector to the
// top pane
// TODO: only use the styled clock panel here so that the media query doesn't hit
// before ours does
const SmallLayout: React.FC<LayoutProps> = ({ onSettingsClick }) => <>
  <TopPane style={{paddingBottom: 0}}>
    <FloatingSettingsIcon onClick={onSettingsClick} />
    <ClockPanel />
  </TopPane>

  <RightDashPanel />
</>;

interface BreakpointConfig {
  XL: number;
  M: number;
  S: number;
}

// function useBreakpoint(breakpoints: BreakpointConfig, debounceThreshold = 250): keyof BreakpointConfig {
//   const [ width, setWidth ] = useState(window.innerWidth);
//   const [ debouncedWidthSubscriber ] = useDebouncedCallback(() => setWidth(window.innerWidth), debounceThreshold);

//   useEffect(() => {
//     window.addEventListener('resize', debouncedWidthSubscriber);
//     return () => window.removeEventListener('resize', debouncedWidthSubscriber);
//   }, [ debouncedWidthSubscriber ]);

//   if (width >= breakpoints.XL) {
//     return 'XL';
//   }

//   if (width < breakpoints.XL && width >= breakpoints.M) {
//     return 'M';
//   }

//   return 'S';
// }

function useBreakpoint2(breakpoints: BreakpointConfig): keyof BreakpointConfig {
  const [ breakpoint, setBreakpoint ] = useState<keyof BreakpointConfig>('XL');

  const lgMql = window.matchMedia(`(min-width: ${breakpoints.XL}px)`);
  const medMql = window.matchMedia(`(max-width: ${breakpoints.XL}px) and (min-width: ${breakpoints.M}px)`);
  const smMql = window.matchMedia(`(max-width: ${breakpoints.S}px)`);

  useEffect(() => {
    const handler = (size: keyof BreakpointConfig) => (event: MediaQueryListEvent) => {
      // console.log(`[${size}] changed:`, event.matches);
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

// TODO: consider increasing panel size to lower the threshold for going to med layout
const Page: React.FC = () => {
  const [ showSettings, setSettingsShowing ] = useState(false);
  const onSettingsClick = () => setSettingsShowing(isShowing => !isShowing);

  const breakpoint = useBreakpoint2({ XL: LayoutBreakpoint.XL, M: LayoutBreakpoint.S, S: LayoutBreakpoint.S });
  const LayoutElement = useMemo(() => {
    switch (breakpoint) {
    case 'XL':
      return () => <LargeLayout onSettingsClick={onSettingsClick} />;
    case 'M':
      return () => <MedLayout onSettingsClick={onSettingsClick} />;
    default:
      return () => <SmallLayout onSettingsClick={onSettingsClick} />;
    }
  }, [ breakpoint ]);

  return (
    <ThemeProvider theme={mainTheme}>
      <PageBackground>
        <LayoutElement />

        <SettingsModal key="settings-modal" isOpen={showSettings}
          onClose={() => setSettingsShowing(false)}
        />
      </PageBackground>
    </ThemeProvider>
  );
};

export default Page;
