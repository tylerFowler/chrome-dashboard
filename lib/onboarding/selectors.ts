import { GlobalState } from '../store';
import { State as OnboardingState, defaultState } from './reducer';

type State = Pick<GlobalState, 'onboarding'>;

export interface SerializableOnboardingProgress {
  tooltipProgress: string[];
}

export function serializeProgress({ onboarding }: State): SerializableOnboardingProgress {
  return {
    tooltipProgress: Array.from(onboarding.tooltipProgress),
  };
}

export function deserializeProgress(serialized: SerializableOnboardingProgress): OnboardingState {
  return { ...defaultState,
    tooltipProgress: new Set(serialized.tooltipProgress),
  };
}
