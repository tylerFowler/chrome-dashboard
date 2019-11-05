import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'lib/styled-components';
import { fontStacks } from 'lib/styles';
import { hasStoredSettings } from 'lib/settings/selectors';
import CloseIcon from './CloseIcon';

interface TooltipContentProps { readonly arrowSize: string; }

const TooltipContent = styled.span.attrs<TooltipContentProps, TooltipContentProps>(props => ({
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

export interface OnboardingTooltipProps {
  readonly targetElement?: HTMLElement;
  readonly tipSize?: string;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({ targetElement, tipSize = '10px', children }) => {
  const $tooltip = useRef<HTMLElement>(null);
  const [ closed, setClosed ] = useState(false);
  const isFirstLoad = !useSelector(hasStoredSettings);

  if (!isFirstLoad || closed) { return null; }

  const position: React.CSSProperties = {};
  if (targetElement && $tooltip.current) {
    const tooltipBuffer = '.15em';
    const { right, bottom, width } = targetElement.getBoundingClientRect();

    position.top = `calc(${bottom}px + (${tipSize} / 2) + ${tooltipBuffer})`;

    const tooltipMidwayPoint = (right - (width / 2)) - ($tooltip.current.getBoundingClientRect().width / 2);
    position.left = `calc(${tooltipMidwayPoint}px - (${tipSize} / 2))`;
  }

  return (
    <TooltipContent style={position} arrowSize={tipSize} ref={$ref => $tooltip.current = $ref}>
      <div>
        <CloseIcon
          style={{margin: '.25em .5em .25em .25em'}}
          size="1em"
          iconColor={t => t.backgroundDarker}
          onClick={() => setClosed(true)}
        />
      </div>

      <div style={{padding: '.25em'}}>
        {children}
      </div>
    </TooltipContent>
  );
};

export default OnboardingTooltip;
