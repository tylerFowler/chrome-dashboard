import styled from 'panel/styled-components';
import { fontStacks, typeScale } from '../../styles';
import { Alignment } from './Panel';

const PanelHeader = styled('header')<{alignment: Alignment}>`
  color: ${props => props.theme.fontColor};
  background-color: ${props => props.theme.primaryColor};
  border-bottom: 2px solid ${props => props.theme.borderDark};
  padding: 1em .5em;

  font-family: ${fontStacks.Montserrat};
  font-size: ${typeScale(8)};

  ${props => {
    const titlePadding = '.75em';
    switch (props.alignment) {
    case 'left':
      return `
        text-align: left;
        padding-left: ${titlePadding};
      `;
    case 'right':
      return `
        text-align: right;
        padding-right: ${titlePadding};
      `;
    }
  }}
`;

export default PanelHeader;
