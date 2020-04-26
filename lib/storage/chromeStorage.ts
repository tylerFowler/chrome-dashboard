import { ApplicationStore } from './interface';

export default class ChromeStorage implements ApplicationStore {
  public setData(key: string, data: object, shouldSync = true): Promise<void> {
    const storageMedium = shouldSync ? chrome.storage.sync : chrome.storage.local;
    const updateObject = { [key]: JSON.stringify(data) };

    return new Promise((resolve, reject) => storageMedium.set(updateObject, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      return resolve();
    }));
  }

  public getData<T = any>(key: string, preferLocal = false): Promise<T> {
    const storageMedium = preferLocal ? chrome.storage.local : chrome.storage.sync;

    return new Promise((resolve, reject) =>
      storageMedium.get(key, items => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }

        if (items[key]) {
          return resolve(JSON.parse(items[key]) as T);
        }

        resolve();
      }),
    );
  }
}
