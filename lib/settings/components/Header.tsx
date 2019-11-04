import React from 'react';
import { useSelector } from 'react-redux';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import styled from 'lib/styled-components';
import { fontStacks, typeScale } from 'lib/styles';
import { Error as ErrorAlert } from 'lib/styled/Alert';
import { getActiveToast, getStorageError } from '../selectors';
import CloseIcon from '../../styled/CloseIcon';
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

const ErrorContainer = styled.span`
  flex: .9;
  margin-top: 1em;
  text-align: center;

  max-height: 3.5em;
  overflow: hidden;

  em {
    display: block;
    margin: .5em auto 0;
  }
`;

const SettingsHeader: React.FC<HeaderProps> = ({ onClose }) => {
  const toast = useSelector(getActiveToast);
  const storageError = useSelector(getStorageError);

  return (
    <HeaderContainer>
      <Heading>Settings</Heading>

      <ReactTransitionGroup
        transitionName="popup"
        transitionEnterTimeout={toastTransitionTime}
        transitionLeaveTimeout={toastTransitionTime}
        style={{display: 'flex'}}
      >
        {toast && !storageError &&
          <ToastTransitionRules>
            <Toast message={toast}
              style={{margin: 'auto', position: 'relative', right: '5%'}}
            />
          </ToastTransitionRules>
        }

      </ReactTransitionGroup>

      {storageError && <ErrorContainer>
        <ErrorAlert>
          There was an problem with settings storage: <br />
          <em>{storageError.message}</em>
        </ErrorAlert>
      </ErrorContainer>}

      <div style={{margin: '1em', display: 'inline-block', float: 'right'}}>
        <CloseIcon onClick={onClose} />
      </div>
    </HeaderContainer>
  );
};

export default SettingsHeader;
