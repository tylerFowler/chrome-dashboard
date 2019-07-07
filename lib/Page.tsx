import React, { useState, useMemo, useEffect } from 'react';
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
  M = 750,
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
  @media (max-width: ${LayoutBreakpoint.M}px) {
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
const SmallLayout: React.FC<LayoutProps> = ({ onSettingsClick }) => <>
  <TopPane style={{paddingBottom: 0}}>
    <FloatingSettingsIcon onClick={onSettingsClick} />
    <ClockPanel />
  </TopPane>

  <RightDashPanel />
</>;

function useViewportWidth(debounceThreshold = 250) {
  const [ width, setWidth ] = useState(window.innerWidth);
  const [ debouncedWidthSubscriber ] = useDebouncedCallback(() => setWidth(window.innerWidth), debounceThreshold);

  useEffect(() => {
    window.addEventListener('resize', debouncedWidthSubscriber);
    return () => window.removeEventListener('resize', debouncedWidthSubscriber);
  }, [ debouncedWidthSubscriber ]);

  return width;
}

// TODO: consider increasing panel size to lower the threshold for going to med layout
const Page: React.FC = () => {
  const [ showSettings, setSettingsShowing ] = useState(false);
  const onSettingsClick = () => setSettingsShowing(isShowing => !isShowing);

  const viewportWidth = useViewportWidth();
  const LayoutElement = useMemo(() => {
    if (viewportWidth >= LayoutBreakpoint.XL) {
      return () => <LargeLayout onSettingsClick={onSettingsClick} />;
    }

    if (viewportWidth < LayoutBreakpoint.XL && viewportWidth >= LayoutBreakpoint.M) {
      return () => <MedLayout onSettingsClick={onSettingsClick} />;
    }

    return () => <SmallLayout onSettingsClick={onSettingsClick} />;
  }, [ viewportWidth ]); // FIXME: may need to memoize onSettingsClick

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
