import action, { ActionType } from 'typesafe-actions';

export enum Actions {
  Tick = 'CLOCK_TICK',
}

export type ClockAction = ActionType<
  | typeof tick
>;

console.log('Action is', action);
export const tick = () => action.action(Actions.Tick);
