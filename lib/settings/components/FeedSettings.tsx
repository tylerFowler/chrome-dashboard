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

  @media (max-width: 800px) {
    flex-direction: column;
  }

  & > div {
    flex: 1 50%;
    min-width: 150px;
  }
`;

const FeedSettingsContainer = styled.div`
  &:last-of-type {
    text-align: right;

    @media (max-width: 750px) {
      margin-top: 1.5em;
      text-align: left;
    }
  }
`;

const FeedPanelSelectorLabel = styled.label`
  font-size: ${typeScale(4)};
  display: block;
`;

const FeedPanelSelect = styled.select`
  margin: 1em 0 0;
  &:focus { outline: 0; }
`;

// TODO: for each option create a component like HNFeedSettings, this should display a mini-form configuring that
//       specific feed, HN & DN don't need them so wait until Reddit
const FeedPanelSelector: React.FC<{ readonly id?: string }> = ({ id }) =>
  <FeedPanelSelect id={id} style={{margin: '1em 0 0'}}>
    <option value="hn">Hacker News</option>
    <option value="hn">Designer News</option>
  </FeedPanelSelect>
;

const FeedSettings: React.FC<FeedSettingsProps> = () =>
  <SettingsForm>
    <legend>Feed Panels</legend>

    <RefreshIntervalSetting onChange={console.log} />

    <PanelSettingsContainer>
      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="left-feed-panel-settings">
          Left Panel
        </FeedPanelSelectorLabel>
        <FeedPanelSelector id="left-feed-panel-settings" />
      </FeedSettingsContainer>

      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="right-feed-panel-settings">
          Right Panel
        </FeedPanelSelectorLabel>
        <FeedPanelSelector />
      </FeedSettingsContainer>
    </PanelSettingsContainer>
  </SettingsForm>
;

export default FeedSettings;
