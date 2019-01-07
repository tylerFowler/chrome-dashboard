import styled from 'lib/styled-components';
import React from 'react';
import { Alignment } from './Panel';

export interface CollapserProps {
  readonly alignment: Alignment;
  toggleCollapse(): void;
}

const Container = styled.div`
  cursor: pointer;
  width: 1em;
  height: 1.5rem;
  padding: .5rem .25rem;

  position: relative;
  top: calc(50% - (1.5rem / 2));

  background-color: blue;
`;

const Arrow = styled('div')<{ alignment: Alignment }>`
  position: relative;
  ${props => {
    const verticalOffset = '-.45em';
    const horizontalOffset = '6px';
    switch (props.alignment) {
    case 'left':
      return `
        transform: rotate(180deg);
        right: ${horizontalOffset};
        &::before { transform: rotate(45deg); bottom: ${verticalOffset}; }
        &::after { transform: rotate(-45deg); }
      `;
    case 'right':
      return `
        left: ${horizontalOffset};
        &::before { transform: rotate(-315deg); }
        &::after { transform: rotate(315deg); top: ${verticalOffset}; }
      `;
    }
  }}

  &::before, &::after {
    content: '';
    display: block;
    position: relative;
    height: 1rem;
    width: .25rem;
    background-color: ${props => props.theme.backgroundLight};
  }
`;

const Collapser: React.FunctionComponent<CollapserProps> = ({ toggleCollapse, alignment }) =>
  <Container onClick={toggleCollapse}>
    <Arrow alignment={alignment} />
  </Container>
;

export default Collapser;
