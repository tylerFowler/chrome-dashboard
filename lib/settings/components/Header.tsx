import styled from 'lib/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';
import CloseIcon from './CloseIcon';
import Toast from './Toast';

export interface HeaderProps {
  readonly toast?: string;
  onClose(): void;
}

const HeaderContainer = styled.header`
  clear: both;
  color: ${props => props.theme.typeLight};
  background-color: ${props => props.theme.backgroundDarker};
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

const SettingsHeader: React.FC<HeaderProps> = ({ onClose }) =>
  <HeaderContainer>
    <Heading>Settings</Heading>

    <Toast message="Settings saved" style={{margin: 'auto', position: 'relative', right: '5%'}} />

    <div style={{margin: '1em', display: 'inline-block', float: 'right'}}>
      <CloseIcon onClick={onClose} />
    </div>
  </HeaderContainer>
;

export default SettingsHeader;
