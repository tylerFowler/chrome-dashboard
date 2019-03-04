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
  padding: .25em .35em;

  font-size: 1.15rem;
  cursor: pointer;
  background: ${props => props.theme.backgroundExtraLight};
  border-radius: 15%;
  border: 2px solid ${props => props.theme.borderDark};
`;

const OpenIcon: React.FC<{ style?: React.CSSProperties; onClick?: () => void }> = props =>
  <IconContainer {...props}>
    <GearIcon />
  </IconContainer>
;

export default OpenIcon;
