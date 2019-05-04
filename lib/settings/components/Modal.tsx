import React, { useRef } from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import { useOutOfBoundsClick, useEscapeKeyUp } from '../../hooks';
import styled from 'lib/styled-components';
import SettingsHeader from '../containers/Header';
import FeedSettings from '../containers/FeedSettings';
import WeatherSettings from '../containers/WeatherSettings';

export interface ModalProps {
  readonly isOpen: boolean;
  onClose(): void;
}

const ModalContainer = styled.div`
  z-index: 999;
  position: absolute;
  margin: auto;
  left: 0; right: 0; top: 0; bottom: 0;

  border: 3px solid ${props => props.theme.backgroundDarker};
  border-radius: 3px;
  background-color: ${props => props.theme.backgroundLight};
  box-shadow: ${props => props.theme.darkShadowColor} 0 5px 10px 5px;

  overflow-y: scroll;
  overflow-x: hidden;

  width: 750px;
  min-height: 500px;
  height: 85vh;
  max-height: 800px;

  @media (max-width: 750px) {
    width: 100%;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }

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

const Settings: React.SFC = () => <SettingsContainer>
  <FeedSettings />
  <WeatherSettings />
</SettingsContainer>;

const SettingsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const $modal = useRef(null);
  useOutOfBoundsClick($modal, onClose, isOpen);
  useEscapeKeyUp(onClose);

  return (
    <ReactTransitionGroup
      transitionName="pop-in"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {isOpen &&
        <ModalContainer key="modal-outer" ref={$modal}>
          <SettingsHeader onClose={onClose} />
          <Settings />
        </ModalContainer>
      }
    </ReactTransitionGroup>
  );
};

export default SettingsModal;
