import React from 'react';
import { HNFeedSettings } from './interface';
import { FeedType } from '../hn/interface';

export const HNSettingsContext = React.createContext<HNFeedSettings>({
  defaultFeedType: FeedType.NewStories,
});
