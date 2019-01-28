interface FeedSettings {
  readonly refreshInterval: number;
  readonly pullSize: number;
}

export interface State {
  readonly feed: FeedSettings;
}
