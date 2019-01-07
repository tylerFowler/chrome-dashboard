import styled from 'lib/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';

export type Alignment = 'left'|'right';

export interface PanelProps {
  readonly title: string;
  readonly panelOrientation: Alignment;
}

const PanelContainer = styled.section`
  background-color: ${props => props.theme.backgroundLightDark};
  height: 100%;
`;

const PanelHeader = styled('header')<{alignment: Alignment}>`
  color: ${props => props.theme.typeLight};
  background-color: ${props => props.theme.backgroundDark};
  border-bottom: 2px solid ${props => props.theme.borderDark};
  padding: 1em .5em;

  font-family: ${fontStacks.Montserrat};
  font-size: ${typeScale(8)};

  ${props => {
    const titlePadding = '.75em';
    switch (props.alignment) {
    case 'left':
      return `
        text-align: left;
        padding-left: ${titlePadding};
      `;
    case 'right':
      return `
        text-align: right;
        padding-right: ${titlePadding};
      `;
    }
  }}
`;

const PanelBody = styled.section`
`;

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
