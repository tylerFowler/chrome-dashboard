export interface ApplicationStore {
  setData(key: string, data: object): Promise<void>;
  getData<T = any>(key: string): Promise<T>;
}
