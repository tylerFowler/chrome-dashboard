import styled from 'lib/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';
import CloseIcon from './CloseIcon';

const HeaderContainer = styled.header`
  clear: both;
  margin: -1em; // opposite of the padding for the settings modal

  color: ${props => props.theme.typeLight};
  background-color: ${props => props.theme.backgroundDarker};
`;

const Heading = styled.h1`
  margin: 1.5rem 0 1.5rem 1rem;
  display: inline-block;

  font-family: ${fontStacks.Montserrat};
  font-weight: normal;
  font-size: ${typeScale(8)};
`;

const SettingsHeader: React.FC<{ onClose(): void }> = ({ onClose }) =>
  <HeaderContainer>
    <Heading>Settings</Heading>

    <div style={{margin: '1em', display: 'inline-block', float: 'right'}}>
      <CloseIcon onClick={onClose} />
    </div>
  </HeaderContainer>
;

export default SettingsHeader;
