import styled from 'lib/styled-components';
import React from 'react';
import { AppTheme } from '../theme';

export interface CloseIconProps {
  readonly size?: string;
  readonly thickness?: string;
  readonly iconColor?: (theme: AppTheme) => string;
  readonly style?: React.CSSProperties;
}

const Icon = styled.div.attrs<CloseIconProps, CloseIconProps>(props => ({
  size: props.size || '1.5rem',
  thickness: props.thickness || '2px',
  iconColor: props.iconColor || (theme => theme.backgroundExtraLight),
}))`
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
    background-color: ${props => props.iconColor(props.theme)};
    transform-origin: center;
  }

  // Compensate both of these for the shapes bleeding over the left edge of
  // their container
  &::before { transform: rotate(45deg); left: calc(${props => props.thickness} + .5em); }
  &::after  { transform: rotate(-45deg); left: .5em; }
`;

const CloseIcon: React.FC<{ onClick(): void } & CloseIconProps> = ({ onClick, ...iconProps }) =>
  <Icon aria-label="Close" onClick={onClick} {...iconProps}></Icon>
;

export default CloseIcon;
