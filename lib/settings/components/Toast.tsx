import React from 'react';
import styled from 'lib/styled-components';
import { typeScale, fontStacks } from '../../styles';

export interface ToastProps {
  readonly message: string;
  readonly style?: React.CSSProperties;
}

const ToastContainer = styled.div`
  text-transform: lowercase;
  border-radius: 3px;

  vertical-align: super;
  display: inline-block;
  margin: 0 auto;
  padding: .25em .5em;

  font-family: ${fontStacks.OpenSans};
  font-size: ${typeScale(3)};
  background: ${props => props.theme.backgroundDark};
  color: ${props => props.theme.typeLight};
`;

const Toast: React.SFC<ToastProps> = ({ message, style }) =>
  <div style={{textAlign: 'center', ...style}}>
    <ToastContainer>
      {message}
    </ToastContainer>
  </div>
;

export default Toast;
