import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from 'lib/store';
import { hasStoredSettings } from 'lib/settings/selectors';
import * as selectors from '../selectors';
import CloseIcon from 'lib/styled/CloseIcon';
import TooltipContainer from './TooltipContainer';
import { completeTooltip } from '../actions';

export interface OnboardingTooltipProps {
  readonly id: string;
  readonly targetElement: HTMLElement;
  readonly whenNoSettings?: boolean;
  readonly tipSize?: string;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  id, targetElement, children,
  tipSize = '10px',
  whenNoSettings = false,
}) => {
  const $tooltip = useRef<HTMLElement>(null);

  const alreadyCompleted = useSelector((state: GlobalState) => selectors.isTooltipCompleted(id, state));
  const [ closed, setClosed ] = useState(alreadyCompleted);

  const onboardingEnabled = useSelector(selectors.isOnboardingEnabled);
  const settingsExist = useSelector(hasStoredSettings);

  // never show if...
  if (
    !onboardingEnabled                   // onboarding is disabled
    || (whenNoSettings && settingsExist) // we require no settings but settings exist
    || alreadyCompleted                  // this tooltip is already marked completed
    || closed                            // this tooltip has been closed
  ) { return null; }

  const position: React.CSSProperties = {};
  if (targetElement && $tooltip.current) {
    const tooltipBuffer = '.15em';
    const { right, bottom, width } = targetElement.getBoundingClientRect();

    position.top = `calc(${bottom}px + (${tipSize} / 2) + ${tooltipBuffer})`;

    const tooltipMidwayPoint = (right - (width / 2)) - ($tooltip.current.getBoundingClientRect().width / 2);
    position.left = `calc(${tooltipMidwayPoint}px - (${tipSize} / 2))`;
  }

  const dispatch = useDispatch();
  const onTooltipClose = () => {
    setClosed(true);
    dispatch(completeTooltip(id));
  };

  return (
    <TooltipContainer style={position} arrowSize={tipSize} ref={$ref => $tooltip.current = $ref}>
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

export default OnboardingTooltip;
