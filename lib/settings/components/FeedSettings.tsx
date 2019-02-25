import React from 'react';

export interface FeedSettingsProps {
  readonly placeholder?: string;
}

const FeedSettings: React.FC<FeedSettingsProps> = () =>
  <form>
    <legend>Feed Panels</legend>
  </form>
;

export default FeedSettings;
