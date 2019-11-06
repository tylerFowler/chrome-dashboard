import { GlobalState } from '../store';
import { State as OnboardingState, defaultState } from './reducer';

type State = Pick<GlobalState, 'onboarding'>;

export interface SerializableOnboardingProgressed {
  tooltipProgress: string[];
}

export function serializeProgress({ onboarding }: State): SerializableOnboardingProgressed {
  return {
    tooltipProgress: Array.from(onboarding.tooltipProgress),
  };
}

export function deserializeProgress(serialized: SerializableOnboardingProgressed): OnboardingState {
  return { ...defaultState,
    tooltipProgress: new Set(serialized.tooltipProgress),
  };
}
