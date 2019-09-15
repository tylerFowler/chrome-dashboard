import { State as Settings } from '../reducer';

export interface SettingsStore {
  commitSettings(settings: Settings): Promise<void>;
  restoreSettings(): Promise<object>;
}
