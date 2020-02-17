export interface ApplicationStore {
  setData(key: string, data: object, shouldSync?: boolean): Promise<void>;
  getData<T = any>(key: string, preferLocal?: boolean): Promise<T>;
}
