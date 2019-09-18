import { State as Settings } from '../reducer';
import { SettingsStore } from './index';

export default class LocalStorageSettingsStore implements SettingsStore {
  private static storageKey = 'settings';
  private storage: Storage;

  constructor(storageMechanism: Storage = localStorage) {
    this.storage = storageMechanism;
  }

  public async commitSettings(settings: Settings) {
    this.storage.setItem(LocalStorageSettingsStore.storageKey, JSON.stringify(settings));
  }

  public async restoreSettings() {
    const settingsString = this.storage.getItem(LocalStorageSettingsStore.storageKey);

    return JSON.parse(settingsString);
  }
}
