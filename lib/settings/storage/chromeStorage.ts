import { State as Settings } from '../reducer';
import { SettingsStore } from './index';

export default class ChromeStorageSettingsStore implements SettingsStore {
  public async commitSettings(settings: Settings) {
    throw new Error('not implemented');
  }

  public async restoreSettings() {
    return {}
  }
}
