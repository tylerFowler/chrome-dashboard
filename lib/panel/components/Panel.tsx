import styled from 'lib/styled-components';
import React from 'react';
import PanelHeader from './Header';

export type Alignment = 'left'|'right';

export interface PanelProps {
  readonly title: string;
  readonly panelOrientation: Alignment;
}

const PanelContainer = styled.section`
  background-color: ${props => props.theme.backgroundLightDark};
  height: 100%;
`;

const PanelBody = styled.section``;

export default class Panel extends React.Component<PanelProps> {
  public render() {
    const { title, panelOrientation, children } = this.props;

    return (
      <PanelContainer>
        <PanelHeader alignment={panelOrientation}>
          {title}
        </PanelHeader>
        <PanelBody>
          {children}
        </PanelBody>
      </PanelContainer>
    );
  }
}
