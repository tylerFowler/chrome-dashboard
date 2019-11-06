import { OnboardingAction, Actions } from './actions';

export interface State {
  onboardingEnabled: boolean;
  tooltipProgress: ReadonlySet<string>; // TODO: ensure that this gets serialized/deserialized properly
  storageError: Error;
}

export const defaultState: State = {
  onboardingEnabled: true,
  tooltipProgress: new Set<string>(),
  storageError: null,
} as const;

export default function reducer(state = defaultState, action: OnboardingAction): State {
  switch (action.type) {
  case Actions.EnableOnboarding:
    return { ...state, onboardingEnabled: true };
  case Actions.DisableOnboarding:
    return { ...state, onboardingEnabled: false };
  case Actions.CompleteTooltip: {
    const updatedProgress = new Set(state.tooltipProgress);
    updatedProgress.add(action.payload.tooltipId);

    return { ...state, tooltipProgress: updatedProgress };
  }
  case Actions.RestoreProgress:
    return { ...state, ...action.payload };
  case Actions.ProgressStorageFailure:
  case Actions.ProgressRestorationFailure:
    return { ...state, storageError: action.payload.error };
  default:
    return state;
  }
}
