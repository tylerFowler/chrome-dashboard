import styled from 'lib/styled-components';
import React from 'react';

const Icon = styled.div`
  cursor: pointer;
  display: inline-block;

  /* compensate for lateral movement */
  margin-right: calc(1rem / 2);
  float: right;

  &::before, &::after {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1.25rem;

    position: relative;
    background-color: ${props => props.theme.backgroundExtraLight};
    transform-origin: center, center;
  }

  &::before { transform: rotate(45deg); left: 2px; }
  &::after  { transform: rotate(-45deg); }
`;

const CloseIcon: React.FC<{ onClick(): void }> = ({ onClick }) =>
  <Icon aria-label="Close" onClick={onClick}>
  </Icon>
;

export default CloseIcon;
