import React from 'react';
import { useDispatch } from 'react-redux';
import { completeTooltip } from '../actions';

// TooltipCompletionTarget is a simple wrapper component that should be used to
// surround an element that, when clicked, satisfies an onboarding tooltip. This
// way when the user completes a suggested action the tooltip can automatically
// go away. Using this element does not affect the visual layout of its children
// in any way nor does it interfere with user interactions.
const TooltipCompletionTarget: React.FC<{ readonly tooltipId: string }> = ({ tooltipId, children }) => {
  const dispatch = useDispatch();

  const targetClickHandler = () => dispatch(completeTooltip(tooltipId));

  return (
    <span style={{display: 'contents'}} onClick={targetClickHandler}>
      {children}
    </span>
  );
};

export default TooltipCompletionTarget;
