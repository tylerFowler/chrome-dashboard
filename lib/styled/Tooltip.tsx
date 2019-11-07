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

// TODO: change targetElement to be 'boundingClientRect', then the parent can wire that up w/ a useRect hook?
export interface TooltipProps {
  readonly targetElement: HTMLElement;
  readonly tipSize?: string;
  readonly defaultClosed?: boolean;
  onClose?(): void;
}

// TODO: consider using forwardRef instead?
const Tooltip: React.FC<TooltipProps> = ({
  targetElement, children,
  defaultClosed = false, tipSize = '10px',
  onClose = () => {},
}) => {
  const [ closed, setClosed ] = useState(defaultClosed);

  if (closed) { return null; }

  const onTooltipClose = () => {
    setClosed(true);
    onClose();
  };

  const [ position, setPosition ] = useState<React.CSSProperties>({});
  const repositionerRef = useCallback(($node: HTMLElement) => {
    if (!targetElement || !$node) { return; }

    const tempPos: React.CSSProperties = {};
    const tooltipBuffer = '.15em';
    const { right, bottom, width } = targetElement.getBoundingClientRect();

    tempPos.top = `calc(${bottom}px + (${tipSize} / 2) + ${tooltipBuffer})`;

    // Position the tooltip so that the middle of the tooltip is lined up vertically
    // width the middle of the target element
    const tooltipMidwayPoint = (right - (width / 2)) - ($node.getBoundingClientRect().width / 2);
    tempPos.left = `calc(${tooltipMidwayPoint}px - (${tipSize} / 2))`;

    setPosition(tempPos);
  }, [ targetElement ]);

  return (
    <TooltipContainer style={position} arrowSize={tipSize} ref={repositionerRef}>
      <div>
        <CloseIcon
          style={{margin: '.25em .5em .25em .25em'}}
          size="1em"
          iconColor={theme => theme.backgroundDarker}
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
