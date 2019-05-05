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

export namespace WeatherLocation {
  export interface City {
    type: WeatherLocationType.CityName;
    value: string;
    countryCode?: string;
    displayName?: string;
  }

  export const isCity = (loc: WeatherLocation): loc is City =>
    loc.type === WeatherLocationType.CityName
    && !!loc.value
  ;

  export interface ZIPCode {
    type: WeatherLocationType.ZIPCode;
    value: string;
    countryCode: string;
    displayName?: string;
  }

  export const isZIPCode = (loc: WeatherLocation): loc is ZIPCode =>
    loc.type === WeatherLocationType.ZIPCode
    && !!loc.value
    && !!loc.countryCode
  ;

  export interface Coords {
    type: WeatherLocationType.Coords|WeatherLocationType.Current;
    value: { lat: string, lon: string };
    displayName?: string;
    countryCode?: string; // must keep this to maintain prop parity with other types
  }

  export const isCoords = (loc: WeatherLocation): loc is Coords =>
    loc.type === WeatherLocationType.Coords
    && !!loc.value
    && !loc.countryCode
  ;
}

export type WeatherLocation =
  | WeatherLocation.City
  | WeatherLocation.ZIPCode
  | WeatherLocation.Coords
;
