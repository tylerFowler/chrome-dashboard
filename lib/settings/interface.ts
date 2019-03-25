export enum FeedType {
  HN = 'hn',
  DN = 'dn',
}

export namespace FeedType {
  export const getDisplayString = (type: FeedType) => {
    switch (type) {
    case FeedType.HN:
      return 'Hacker News';
    case FeedType.DN:
      return 'Designer News';
    }
  };
}

export interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: object; // TODO: replace w/ specific feed settings
}

