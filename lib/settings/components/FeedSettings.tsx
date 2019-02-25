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

const FeedSettings: React.FC<FeedSettingsProps> = () =>
  <SettingsForm>
    <legend>Feed Panels</legend>

    <RefreshIntervalSetting onChange={console.log} />

    <PanelSettingsContainer>
      <div>
        <h3>Left Panel</h3>
      </div>
      <div>
        {/* TODO: when a break happens due to viewport width this should left align */}
        <h3 style={{textAlign: 'right'}}>Right Panel</h3>
      </div>
    </PanelSettingsContainer>
  </SettingsForm>
;

export default FeedSettings;
