import styled from 'lib/styled-components';
import React from 'react';
import { typeScale } from '../../styles';
import SettingsForm, { SettingField, SettingInput, SettingLabel } from './SettingsForm';

export interface FeedSettingsProps {
  readonly placeholder?: string;
}

const RefreshIntervalInput = styled(SettingInput).attrs({
  type: 'number',
  min: 1,
})`
  width: 4em;
  display: inline-block;

  & + span {
    margin-left: 1em;
    text-align: text-top;
  }
`;

const RefreshIntervalSetting: React.FC<{ defaultIval?: number, onChange(ivalMinutes: number): void }> =
({ defaultIval = 10, onChange }) =>
    <SettingField>
      <SettingLabel htmlFor="feed-refresh-ival">Feed Autorefresh</SettingLabel>

      <RefreshIntervalInput id="feed-refresh-ival" defaultValue={defaultIval.toString()}
        onChange={e => onChange(e.target.valueAsNumber)}
      />

      <span>minutes</span>
    </SettingField>
;

const PanelSettingsContainer = styled(SettingField)`
  display: flex;

  & > div {
    flex: 1 50%;
    min-width: 150px;
  }

  & h3 {
    margin: 0;
    font-size: ${typeScale(4)};
    font-weight: normal;
  }
`;

// TODO: add ability to mark select values as disabled
// TODO: style like other inputs
// TODO: add ID & hook up w/ htmlFor for the left & right panel h3's (use labels instead, or hidden labels)
// TODO: for each option create a component like HNFeedSettings, this should display a mini-form configuring that
//       specific feed
const FeedPanelSelector: React.FC = () =>
  <select style={{margin: '1em 0 0'}}>
    <option value="hn">Hacker News</option>
    <option value="hn">Designer News</option>
    <option value="rss">RSS</option>
    <option value="lobster">Lobst.er</option>
  </select>
;

const FeedSettings: React.FC<FeedSettingsProps> = () =>
  <SettingsForm>
    <legend>Feed Panels</legend>

    <RefreshIntervalSetting onChange={console.log} />

    <PanelSettingsContainer>
      <div>
        <h3>Left Panel</h3>
        <FeedPanelSelector />
      </div>

      {/* TODO: when a break happens due to viewport width this should left align */}
      <div style={{textAlign: 'right'}}>
        <h3>Right Panel</h3>
        <FeedPanelSelector />
      </div>
    </PanelSettingsContainer>
  </SettingsForm>
;

export default FeedSettings;
