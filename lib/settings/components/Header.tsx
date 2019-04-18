import React from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import styled from 'lib/styled-components';
import { fontStacks, typeScale } from '../../styles';
import CloseIcon from './CloseIcon';
import Toast from './Toast';

export interface HeaderProps {
  readonly toast?: string;
  onClose(): void;
}

const HeaderContainer = styled.header`
  color: ${props => props.theme.typeLight};
  background-color: ${props => props.theme.backgroundDarker};

  clear: both;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h1`
  margin: 1.5rem 0 1.5rem 1rem;
  display: inline-block;

  font-family: ${fontStacks.Montserrat};
  font-weight: normal;
  font-size: ${typeScale(8)};
`;

const toastTransitionTime = 750;

const ToastTransitionRules = styled.span`
  display: flex;

  &.popup-enter { transform: translateY(50vh); }
  &.popup-enter-active { transform: translateY(0); transition: transform ${toastTransitionTime}ms ease-out; }

  &.popup-leave { transform: translateY(0); }
  &.popup-leave-active { transform: translateY(-50vh); transition: transform ${toastTransitionTime}ms ease-in; }
`;

const SettingsHeader: React.FC<HeaderProps> = ({ toast, onClose }) =>
  <HeaderContainer>
    <Heading>Settings</Heading>

    <ReactTransitionGroup
      transitionName="popup"
      transitionEnterTimeout={toastTransitionTime}
      transitionLeaveTimeout={toastTransitionTime}
      style={{display: 'flex'}}
    >
      {toast &&
        <ToastTransitionRules>
          <Toast message={toast}
            style={{margin: 'auto', position: 'relative', right: '5%'}}
          />
        </ToastTransitionRules>
      }
    </ReactTransitionGroup>

    <div style={{margin: '1em', display: 'inline-block', float: 'right'}}>
      <CloseIcon onClick={onClose} />
    </div>
  </HeaderContainer>
;

export default SettingsHeader;
