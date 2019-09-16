import { State as Settings } from '../reducer';
import { SettingsStore } from './index';

export default class ChromeStorageSettingsStore implements SettingsStore {
  private static storageKey = 'settings';

  public commitSettings(settings: Settings): Promise<void> {
    const updateObject = {
      [ChromeStorageSettingsStore.storageKey]: JSON.stringify(settings),
    };

    return new Promise((resolve, reject) => chrome.storage.sync.set(updateObject, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      return resolve();
    }));
  }

  public async restoreSettings(): Promise<Settings> {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get(ChromeStorageSettingsStore.storageKey, items => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }

        return resolve(JSON.parse(items[ChromeStorageSettingsStore.storageKey]) as Settings);
      }),
    );
  }
}
