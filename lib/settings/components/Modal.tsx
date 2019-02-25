import styled from 'lib/styled-components';
import React from 'react';
import SettingsHeader from './Header';

export interface PanelProps {
  onClose(): void;
}

const ModalContainer = styled.div`
  z-index: 999;
  position: absolute;
  width: 750px;
  height: 500px;
  margin: auto;
  left: 0; right: 0; top: 0; bottom: 0;

  padding: 1em;

  border: 3px solid ${props => props.theme.backgroundDarker};
  border-radius: 3px;
  background-color: ${props => props.theme.backgroundLight};
  box-shadow: ${props => props.theme.darkShadowColor} 0 5px 10px 5px;
`;

const SettingsModal: React.FC<PanelProps> = ({ onClose }) =>
  <ModalContainer>
    <SettingsHeader onClose={onClose} />
  </ModalContainer>
;

export default SettingsModal;
