import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from 'lib/store';
import { hasStoredSettings } from 'lib/settings/selectors';
import * as selectors from '../selectors';
import Tooltip, { TooltipProps } from 'lib/styled/Tooltip';
import { completeTooltip } from '../actions';

export interface OnboardingTooltipProps extends TooltipProps {
  readonly id: string;
  readonly whenNoSettings?: boolean;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  id, children, whenNoSettings = false, ...tooltipProps
}) => {
  const alreadyCompleted = useSelector((state: GlobalState) => selectors.isTooltipCompleted(id, state));
  const onboardingEnabled = useSelector(selectors.isOnboardingEnabled);
  const settingsExist = useSelector(hasStoredSettings);

  const dispatch = useDispatch();
  // never show if...
  if (
    !onboardingEnabled                   // onboarding is disabled
    || (whenNoSettings && settingsExist) // we require no settings but settings exist
    || alreadyCompleted                  // this tooltip is already marked completed
  ) { return null; }

  const onTooltipClose = () => {
    dispatch(completeTooltip(id));
  };

  return <Tooltip defaultClosed={alreadyCompleted} onClose={onTooltipClose} {...tooltipProps}>{children}</Tooltip>;
};

export default OnboardingTooltip;
