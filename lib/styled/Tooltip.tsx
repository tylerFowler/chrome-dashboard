import React, { useState, useCallback } from 'react';
import styled from 'lib/styled-components';
import { fontStacks } from 'lib/styles';
import CloseIcon from './CloseIcon';

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

  background-color: ${props => props.theme.backgroundAccent};
  color: ${props => props.theme.typeDarkSemiLight};
  border: 2px solid ${props => props.theme.borderAccent};
  border-radius: 4px;
  border-top-width: .5em;

  box-shadow: 0 0 .5em .2em ${props => props.theme.darkAccentShadowColor};

  &::after {
    content: '';

    position: absolute;
    left: calc(50% - (${props => props.arrowSize} / 2));
    top: calc((${props => props.arrowSize} * -2) - .5em); // -.5em to compensate for top border

    border: ${props => props.arrowSize} solid transparent;
    border-bottom: ${props => props.arrowSize} solid ${props => props.theme.borderAccent};
  }
`;

export interface TooltipProps {
  readonly targetElement: Readonly<HTMLElement>;
  readonly tipSize?: string;
  readonly defaultClosed?: boolean;
  onClose?(): void;
}

const Tooltip: React.FC<TooltipProps> = ({
  targetElement, children,
  defaultClosed = false, tipSize = '10px',
  onClose = () => {},
}) => {
  const [ closed, setClosed ] = useState(defaultClosed);

  const onTooltipClose = () => {
    setClosed(true);
    onClose();
  };

  const [ position, setPosition ] = useState<React.CSSProperties>({});
  const repositionerRef = useCallback(($tooltip: HTMLElement) => {
    if (!targetElement || !$tooltip) { return; }

    const pos: React.CSSProperties = {};
    const tooltipBuffer = '5px';
    const { right, bottom, width } = targetElement.getBoundingClientRect();

    // fix the top of the tooltip to the bottom of the target, accounting for
    // the protruding tip and adding a bit of a buffer
    pos.top = `calc(${bottom}px + (${tipSize} / 2) + ${tooltipBuffer})`;

    // position the tooltip so that the middle of the tooltip is lined up
    // vertically width the middle of the target element
    const tooltipMidwayPoint = (right - (width / 2)) - ($tooltip.getBoundingClientRect().width / 2);
    pos.left = `calc(${tooltipMidwayPoint}px - (${tipSize} / 2))`;

    setPosition(pos);
  }, [ targetElement ]);

  if (closed || !targetElement) { return null; }

  return (
    <TooltipContainer style={position} arrowSize={tipSize} ref={repositionerRef}>
      <div>
        <CloseIcon
          style={{margin: '.25em .5em .25em .25em'}}
          size="1em"
          iconColor={theme => theme.borderAccent}
          onClick={onTooltipClose}
        />
      </div>

      <div style={{padding: '.25em'}}>
        {children}
      </div>
    </TooltipContainer>
  );
};

export default Tooltip;
