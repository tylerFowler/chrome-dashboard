import { ApplicationStore } from './interface';

export default class LocalStorage implements ApplicationStore {
  private storage: Storage;

  constructor(storageMechanism: Storage = window.localStorage) {
    this.storage = storageMechanism;
  }

  public setData = async (key: string, data: object) => {
    this.storage.setItem(key, JSON.stringify(data));
  }

  public getData = async <T = any>(key: string): Promise<T> => {
    return JSON.parse(this.storage.getItem(key)) as T;
  }
}
