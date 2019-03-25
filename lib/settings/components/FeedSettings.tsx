import styled from 'lib/styled-components';
import React from 'react';
import { typeScale } from '../../styles';
import { FeedType } from '../interface';
import SettingsForm, { SettingField, SettingInput, SettingLabel } from './SettingsForm';

export interface FeedSettingsProps {
  readonly feedRefreshIval: number;
  updateFeedRefreshIval(ivalMinutes: number): void;

  readonly leftPanelType: FeedType;
  readonly leftPanelSettings: object;
  updateLeftPanel(type: FeedType, settings?: object): void;

  readonly rightPanelType: FeedType;
  readonly rightPanelSettings: object;
  updateRightPanel(type: FeedType, settings?: object): void;
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

export interface FeedPanelSelectorProps {
  readonly id?: string;
  readonly value?: FeedType;
  onChange?(type: FeedType): void;
}

// TODO: for each option create a component like HNFeedSettings, this should display a mini-form configuring that
//       specific feed, HN & DN don't need them so wait until Reddit
const FeedPanelSelector: React.FC<FeedPanelSelectorProps> = ({ id, value, onChange }) => {
  const opts = [
    FeedType.HN,
    FeedType.DN,
  ].map(type =>
    <option key={type} value={type} selected={type === value}>
      {FeedType.getDisplayString(type)}
    </option>,
  );

  const changeHandler = (event: React.FormEvent<HTMLSelectElement>) =>
    onChange(event.currentTarget.value as FeedType);

  return (
    <FeedPanelSelect id={id} style={{margin: '1em 0 0'}} onChange={changeHandler}>
      {opts}
    </FeedPanelSelect>
  );
};

FeedPanelSelector.defaultProps = { onChange: () => {} };

const FeedSettings: React.FC<FeedSettingsProps> = props =>
  <SettingsForm>
    <legend>Feed Panels</legend>

    <RefreshIntervalSetting defaultIval={props.feedRefreshIval} onChange={props.updateFeedRefreshIval} />

    <PanelSettingsContainer>
      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="left-feed-panel-settings">
          Left Panel
        </FeedPanelSelectorLabel>

        <FeedPanelSelector id="left-feed-panel-settings" value={props.leftPanelType}
          onChange={type => props.updateLeftPanel(type)}
        />
      </FeedSettingsContainer>

      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="right-feed-panel-settings">
          Right Panel
        </FeedPanelSelectorLabel>

        <FeedPanelSelector id="right-feed-panel-settings" value={props.rightPanelType}
          onChange={type => props.updateRightPanel(type)}
        />
      </FeedSettingsContainer>
    </PanelSettingsContainer>
  </SettingsForm>
;

export default FeedSettings;
