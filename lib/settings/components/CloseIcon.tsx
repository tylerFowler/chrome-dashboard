import styled from 'lib/styled-components';
import React from 'react';

const Icon = styled.div`
  cursor: pointer;
  display: inline-block;
  float: right;

  width: 1.5rem;
  height: 1.5rem;

  &::before, &::after {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1.25rem;

    position: relative;
    background-color: ${props => props.theme.backgroundExtraLight};
    transform-origin: center;
  }

  // Compensate both of these for the shapes bleeding over the left edge of
  // their container
  &::before { transform: rotate(45deg); left: calc(2px + .5em); }
  &::after  { transform: rotate(-45deg); left: .5em; }
`;

const CloseIcon: React.FC<{ onClick(): void }> = ({ onClick }) =>
  <Icon aria-label="Close" onClick={onClick}>
  </Icon>
;

export default CloseIcon;
