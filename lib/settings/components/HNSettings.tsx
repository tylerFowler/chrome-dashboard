import React from 'react';
import { SettingInlineLabel, SettingField, SettingSelect } from './SettingsForm';
import { PageType as HNFeedType } from '../../hn/interface';

export interface HNSettingsProps {
  readonly defaultFeedType: HNFeedType;
  setDefaultFeedType(feed: HNFeedType): void;
}

const HNSettings: React.SFC<HNSettingsProps> = props => {
  const { defaultFeedType, setDefaultFeedType } = props;

  const defaultFeedChange = (e: React.FormEvent<HTMLSelectElement>) =>
    setDefaultFeedType(e.currentTarget.value as HNFeedType);

  return (
    <>
      <SettingField>
        <SettingInlineLabel htmlFor="hn-default-feed-type">Default Feed Type:</SettingInlineLabel>
        <SettingSelect id="hn-default-feed-type" value={defaultFeedType} onChange={defaultFeedChange}>
          <option value={HNFeedType.TopStories} defaultChecked={true}>top</option>
          <option value={HNFeedType.NewStories}>new</option>
          <option value={HNFeedType.BestStories}>best</option>
          <option value={HNFeedType.ShowStories}>show</option>
        </SettingSelect>
      </SettingField>
    </>
  );
};

HNSettings.defaultProps = {
  setDefaultFeedType() {},
};

export default HNSettings;
