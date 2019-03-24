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

interface PanelSettings {
  readonly type: FeedType;
  readonly feedSettings?: object; // TODO: replace w/ specific feed settings
}

interface FeedSettings {
  readonly refreshInterval: number; // the refresh interval for all panels in minutes
  readonly pullSize: number;
  readonly panels: {
    readonly left: PanelSettings;
    readonly right: PanelSettings;
  };
}

const defaultFeedSettings: FeedSettings = {
  refreshInterval: 10,
  pullSize: 10,
  panels: {
    left: { type: FeedType.DN },
    right: { type: FeedType.HN },
  },
};

export interface State {
  readonly feed: FeedSettings;
}

export const defaultState: State = { feed: defaultFeedSettings };

export default function settingsReducer(state: State = defaultState, action: object): State; {
  return state;
}
