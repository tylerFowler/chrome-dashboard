import styled from 'lib/styled-components';
import { fontStacks } from 'lib/styles';

interface TooltipContainerProps { readonly arrowSize: string; }

const TooltipContainer = styled.span.attrs<TooltipContainerProps, TooltipContainerProps>(props => ({
  arrowSize: props.arrowSize || '10px',
}))`
  z-index: 1;
  position: absolute;
  display: inline-block;
  max-width: 200px;

  font-size: .9em;
  font-family: ${fontStacks.OpenSans};
  line-height: 1.2;

  background-color: ${props => props.theme.backgroundLightDark};
  color: ${props => props.theme.typeDark};
  border: 2px solid ${props => props.theme.borderDarkLight};
  border-radius: 4px;

  box-shadow: 0 0 .5em .175em ${props => props.theme.darkShadowColor};

  &::after {
    content: '';

    position: absolute;
    bottom: 100%;
    left: calc(50% - (${props => props.arrowSize} / 2));
    top: calc(${props => props.arrowSize} * -2);

    border: ${props => props.arrowSize} solid transparent;
    border-bottom: ${props => props.arrowSize} solid ${props => props.theme.borderDarkLight};
  }
`;

export default TooltipContainer;
