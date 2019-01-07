import styled, { ThemeProvider } from 'panel/styled-components';
import React from 'react';
import PanelTheme, { defaultTheme } from '../panelTheme';
import PanelHeader from './Header';

export type Alignment = 'left'|'right';

export interface PanelProps {
  readonly style?: React.CSSProperties;
  readonly theme?: PanelTheme;
  readonly title: string;
  readonly panelOrientation: Alignment;
}

export interface PanelState {
  readonly isCollapsed: boolean;
}

const PanelContainer = styled('section')<{isCollapsed: boolean}>`
  overflow: hidden;
  background-color: ${props => props.theme.backgroundLightDark};
  height: 100%;

  ${props => props.isCollapsed && 'width: 0; flex: 0 !important;'}
`;

const PanelBody = styled.section``;

export default class Panel extends React.Component<PanelProps, PanelState> {
  public static defaultProps: Partial<PanelProps> = {
    theme: defaultTheme,
  };

  constructor(props: PanelProps) {
    super(props);
    this.state = { isCollapsed: false };
  }

  public toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  public render() {
    const { style, title, panelOrientation, children } = this.props;

    return (
      <ThemeProvider theme={this.props.theme}>
        <PanelContainer style={style} isCollapsed={this.state.isCollapsed}>
          <PanelHeader alignment={panelOrientation}>
            {title}
          </PanelHeader>
          <PanelBody>
            {children}
          </PanelBody>
        </PanelContainer>
      </ThemeProvider>
    );
  }
}
