import { FeedType as HNFeedType } from '../hn/interface';

export type PanelOrientation = 'left' | 'right';

export enum FeedType {
  HN = 'hn',
  DN = 'dn',
  Reddit = 'reddit',
}

export namespace FeedType {
  export const getDisplayString = (type: FeedType) => {
    switch (type) {
    case FeedType.HN:
      return 'Hacker News';
    case FeedType.DN:
      return 'Designer News';
    case FeedType.Reddit:
      return 'Reddit';
    }
  };
}

export type FeedPanelSettings = HNFeedSettings;

export interface HNFeedSettings {
  readonly defaultFeedType: HNFeedType;
}
