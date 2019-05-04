import { FeedType as HNFeedType } from '../hn/interface';

export type PanelOrientation = 'left' | 'right';

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

export type FeedPanelSettings = HNFeedSettings;

export interface HNFeedSettings {
  readonly defaultFeedType: HNFeedType;
}

export enum WeatherLocationType {
  CityName = 'city_name',
  ZIPCode = 'zip',
  Coords = 'coords',
  Current = 'current',
}

export interface WeatherLocation {
  type: WeatherLocationType;
  value?: string;
  countryCode?: string;
  displayName?: string;
}
