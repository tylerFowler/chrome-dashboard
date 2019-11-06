import { action, ActionType } from 'typesafe-actions';
import { State } from './reducer';

export enum Actions {
  EnableOnboarding = 'ONBOARDING_ENABLE',
  DisableOnboarding = 'ONBOARDING_DISABLE',

  CompleteTooltip = 'ONBOARDING_TOOLTIP_COMPLETED',

  ProgressStorageFailure = 'ONBOARDING_PROGRESS_STORAGE_FAILURE',
  ProgressRestorationFailure = 'ONBOARDING_PROGRESS_RESTORATION_FAILURE',
  RestoreProgress = 'ONBOARDING_PROGRESS_RESTORATION',
}

export type OnboardingAction = ActionType<
  | typeof enableOnboarding
  | typeof disableOnboarding
  | typeof completeTooltip
  | typeof progressStorageFailure
  | typeof restoreProgress
  | typeof progressRestorationFailure
>;

export const enableOnboarding = () => action(Actions.EnableOnboarding);
export const disableOnboarding = () => action(Actions.DisableOnboarding);

export const completeTooltip = (tooltipId: string) =>
  action(Actions.CompleteTooltip, { tooltipId });

export const progressStorageFailure = (error: Error) =>
  action(Actions.ProgressStorageFailure, { error });

export const restoreProgress = (state: State) =>
  action(Actions.RestoreProgress, state);

export const progressRestorationFailure = (error: Error) =>
  action(Actions.ProgressRestorationFailure, { error });
