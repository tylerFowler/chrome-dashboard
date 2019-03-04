import styled from 'lib/styled-components';
import React from 'react';

const gearIconPath = 'assets/settings-gear.svg';

const GearIcon = styled.img.attrs({ src: gearIconPath })`
  width: 1.5em;
  height: 1.5em;
`;

const IconContainer = styled.div`
  display: inline;
  position: absolute;
  padding: 1.25em .35em .25em;
  margin-top: -1rem; // pull "up" off the page

  font-size: 1.15rem;
  cursor: pointer;
  background: ${props => props.theme.backgroundExtraLight};
  border-radius: 15%;
  border: 2px solid ${props => props.theme.borderDark};

  transition: padding .2s ease-out;
  &:hover {
    padding-top: 1.75em;
    transition: padding .175s ease-in-out;
    transition-delay: .075s;
  }

  &:focus { padding-top: 1.25em; }
`;

const OpenIcon: React.FC<{ style?: React.CSSProperties; onClick?: () => void }> = props =>
  <IconContainer style={props.style} onClick={props.onClick}>
    <GearIcon style={{userSelect: 'none'}} />
  </IconContainer>
;

export default OpenIcon;
