import React from 'react';
import { PanelOrientation } from '../reducer';
import { PageType as HNFeedType } from '../../hn/interface';
import { SettingInlineLabel, SettingField, SettingSelect } from './SettingsForm';

export interface HNSettingsProps {
  readonly panelOrientation: PanelOrientation;
  readonly defaultFeedType: HNFeedType;
  setDefaultFeedType(feed: HNFeedType): void;
}

const HNSettings: React.SFC<HNSettingsProps> = props => {
  const { panelOrientation, defaultFeedType, setDefaultFeedType } = props;

  const makeId = (id: string) => `${id}-${panelOrientation}`;

  const defaultFeedChange = (e: React.FormEvent<HTMLSelectElement>) =>
    setDefaultFeedType(e.currentTarget.value as HNFeedType);

  return (
    <>
      <SettingField>
        <SettingInlineLabel htmlFor={makeId('hn-default-feed-type')}>Default Feed Type:</SettingInlineLabel>
        <SettingSelect id={makeId('hn-default-feed-type')} value={defaultFeedType} onChange={defaultFeedChange}>
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
  panelOrientation: 'left',
  setDefaultFeedType() {},
};

export default HNSettings;
