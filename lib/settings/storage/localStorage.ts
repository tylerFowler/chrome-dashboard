import { State as Settings } from '../reducer';
import { SettingsStore } from './index';

export default class LocalStorageSettingsStore implements SettingsStore {
  private static storageKey = 'settings';

  public async commitSettings(settings: Settings) {
    localStorage.setItem(LocalStorageSettingsStore.storageKey, JSON.stringify(settings));
  }

  public async restoreSettings() {
    const settingsString = localStorage.getItem(LocalStorageSettingsStore.storageKey);

    return JSON.parse(settingsString);
  }
}
