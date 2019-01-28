import React from 'react';
import styled from '../styled-components';
import { Alignment } from './Panel';

export interface RefreshProps {
  orientation: Alignment;
  onClick(): void;
}

const RefreshIcon = styled.img`
  cursor: pointer;

  width: 1.75em;
  height: 1.75em;
`;

const Refresh: React.FC<RefreshProps> = ({ orientation, onClick }) =>
  <div style={{textAlign: orientation === 'right' ? 'right' : 'left'}}>
    <RefreshIcon onClick={onClick} src="assets/refresh-two-arrow.svg" />
  </div>
;

export default Refresh;
