import styled from 'lib/styled-components';
import React from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import FeedSettings from './FeedSettings';
import SettingsHeader from './Header';

export interface PanelProps {
  readonly isOpen: boolean;
  onClose(): void;
}

const ModalContainer = styled.div`
  z-index: 999;
  position: absolute;
  width: 750px;
  height: 500px;
  margin: auto;
  left: 0; right: 0; top: 0; bottom: 0;

  border: 3px solid ${props => props.theme.backgroundDarker};
  border-radius: 3px;
  background-color: ${props => props.theme.backgroundLight};
  box-shadow: ${props => props.theme.darkShadowColor} 0 5px 10px 5px;

  &.pop-in-enter { transform: scale(0); }
  &.pop-in-enter-active {
    transform: scale(1);
    transition: transform 500ms ease-in-out;
  }

  &.pop-in-leave { transform: scale(1); }
  &.pop-in-leave-active {
    transform: scale(0);
    transition: transform 300ms ease-in-out;
  }
`;

const SettingsContainer = styled.section`
  padding: 1em;
`;

const SettingsModal: React.FC<PanelProps> = ({ isOpen, onClose }) =>
  <ReactTransitionGroup
    transitionName="pop-in"
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}
  >
    {isOpen &&
      <ModalContainer key="modal-outer">
        <SettingsHeader onClose={onClose} />

        <SettingsContainer>
          <FeedSettings />
        </SettingsContainer>
      </ModalContainer>
    }
  </ReactTransitionGroup>
;

export default SettingsModal;
