import { ApplicationStore } from './interface';

export default class ChromeStorage implements ApplicationStore {
  public setData(key: string, data: object): Promise<void> {
    const updateObject = { [key]: JSON.stringify(data) };

    return new Promise((resolve, reject) => chrome.storage.sync.set(updateObject, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      return resolve();
    }));
  }

  public getData<T = any>(key: string): Promise<T> {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get(key, items => {
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
