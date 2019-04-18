import React from 'react';
import styled from 'lib/styled-components';
import { typeScale, fontStacks } from '../../styles';

export interface ToastProps {
  readonly message: string;
  readonly style?: React.CSSProperties;
}

const ToastContainer = styled.div`
  text-transform: lowercase;
  text-align: center;
  border-radius: 3px;

  display: inline-block;
  padding: .5em .75em;

  font-family: ${fontStacks.OpenSans};
  font-size: ${typeScale(3)};
  background: ${props => props.theme.backgroundDark};
  color: ${props => props.theme.typeLight};
`;

const Toast: React.SFC<ToastProps> = ({ message, style }) =>
  <ToastContainer style={{...style}}>
    {message}
  </ToastContainer>
;

export default Toast;
