import styled from 'lib/styled-components';
import React from 'react';

export interface CloseIconProps {
  readonly size: string;
  readonly thickness: string;
  readonly color: string;
}

const Icon = styled.div.attrs<any, CloseIconProps>({
  size: '1.5rem',
  thickness: '2px',
  color: '',
})`
  cursor: pointer;
  display: inline-block;
  float: right;

  width: ${props => props.size};
  height: ${props => props.size};

  &::before, &::after {
    content: '';
    display: inline-block;

    width: ${props => props.thickness};
    height: ${props => props.size};

    position: relative;
    background-color: ${props => props.color || props.theme.backgroundExtraLight};
    transform-origin: center;
  }

  // Compensate both of these for the shapes bleeding over the left edge of
  // their container
  &::before { transform: rotate(45deg); left: calc(2px + .5em); }
  &::after  { transform: rotate(-45deg); left: .5em; }
`;

const CloseIcon: React.FC<{ onClick(): void } & CloseIconProps> = ({ onClick, ...iconProps }) =>
  <Icon aria-label="Close" onClick={onClick} {...iconProps}></Icon>
;

export default CloseIcon;
