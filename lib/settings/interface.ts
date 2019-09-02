import { FeedType as HNFeedType } from '../hn/interface';
import { FeedType as RedditFeedType } from '../reddit/interface';
import { PanelThemeCustomization } from '../panel/panelTheme';

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
      return 'Subreddit';
    }
  };
}

export type FeedPanelSettings = HNFeedSettings|SubredditFeedSettings;

export interface HNFeedSettings {
  readonly defaultFeedType: HNFeedType;
}

export interface SubredditFeedSettings {
  readonly sub: string;
  readonly displayName?: string;
  readonly defaultFeedType: RedditFeedType;
  readonly theme: PanelThemeCustomization;
}
