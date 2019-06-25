import styled from 'lib/styled-components';
import React, { useState } from 'react';
import { typeScale } from '../../../styles';
import { FeedType, PanelOrientation } from '../../interface';
import HNSettings from '../../containers/HNFeedPanelSettings';
import SettingsForm, { SettingField, SettingFieldGroup, SettingInput, SettingLabel } from '../SettingsForm';

export interface FeedSettingsProps {
  readonly feedRefreshIval: number;
  updateFeedRefreshIval(ivalMinutes: number): void;

  readonly feedPullSize: number;
  updateFeedPullSize(pullSize: number): void;

  readonly leftPanelType: FeedType;
  readonly leftPanelSettings: object;
  updateLeftPanel(type: FeedType): void;

  readonly rightPanelType: FeedType;
  readonly rightPanelSettings: object;
  updateRightPanel(type: FeedType): void;
}

const RefreshIntervalInput = styled(SettingInput).attrs({
  type: 'number',
  min: 5,
})`
  width: 4em;
  display: inline-block;

  & + span {
    margin-left: 1em;
    text-align: text-top;
  }
`;

const RefreshIntervalSetting: React.FC<{ defaultIval?: number, onChange(ivalMinutes: number): void }> =
({ defaultIval = 10, onChange }) => {
  const [ ival, setIval ] = useState(defaultIval);

  return (
    <SettingField>
      <SettingLabel htmlFor="feed-refresh-ival">Feed Autorefresh</SettingLabel>

      <RefreshIntervalInput id="feed-refresh-ival" value={ival.toString()}
        onChange={e => {
          onChange(e.target.valueAsNumber);
          setIval(e.target.valueAsNumber);
        }}
      />

      <span>{ival === 1 ? 'minute' : 'minutes'}</span>
    </SettingField>
  );
};

const PullSizeInput = styled(SettingInput).attrs({
  type: 'number',
  min: 1,
})`width: 4em`;

const PullSizeSettings: React.SFC<{ defaultSize?: number, onChange(size: number): void }> =
({ defaultSize = 10, onChange }) =>
  <SettingField>
    <SettingLabel htmlFor="feed-pull-size">Feed Item Size</SettingLabel>

    <PullSizeInput id="feed-pull-size" defaultValue={defaultSize.toString()}
      onChange={e => onChange(e.target.valueAsNumber)}
    />
  </SettingField>
;

const PanelSettingsContainer = styled(SettingField)`
  display: flex;

  @media (max-width: 750px) {
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
  readonly orientation: PanelOrientation;
  readonly id?: string;
  readonly value?: FeedType;
  onChange?(type: FeedType): void;
}

const SettingsMiniform = styled.fieldset`
  border: 0;
  padding: 1em 0;
`;

const FeedPanelSelector: React.FC<FeedPanelSelectorProps> = ({ orientation, id, value, onChange }) => {
  const changeHandler = (event: React.FormEvent<HTMLSelectElement>) =>
    onChange(event.currentTarget.value as FeedType);

  let settingsForm: React.ReactElement;
  switch (value) {
  case FeedType.HN:
    settingsForm = <HNSettings panelOrientation={orientation} />;
  }

  return (
    <>
      <FeedPanelSelect id={id} style={{margin: '1em 0 0'}} onChange={changeHandler} value={value}>
        <option value={FeedType.HN} defaultChecked={true}>Hacker News</option>
        <option value={FeedType.DN}>Designer News</option>
      </FeedPanelSelect>

      <SettingsMiniform>
        {settingsForm}
      </SettingsMiniform>
    </>
  );
};

FeedPanelSelector.defaultProps = { onChange: () => {} };

const FeedSettings: React.FC<FeedSettingsProps> = props =>
  <SettingsForm>
    <legend>Feed Panels</legend>

    <SettingFieldGroup>
      <RefreshIntervalSetting defaultIval={props.feedRefreshIval} onChange={props.updateFeedRefreshIval} />
      <PullSizeSettings defaultSize={props.feedPullSize} onChange={props.updateFeedPullSize} />
    </SettingFieldGroup>

    <PanelSettingsContainer>
      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="left-feed-panel-settings">
          Left Panel
        </FeedPanelSelectorLabel>

        <FeedPanelSelector id="left-feed-panel-settings" value={props.leftPanelType} orientation="left"
          onChange={type => props.updateLeftPanel(type)}
        />
      </FeedSettingsContainer>

      <FeedSettingsContainer>
        <FeedPanelSelectorLabel htmlFor="right-feed-panel-settings">
          Right Panel
        </FeedPanelSelectorLabel>

        <FeedPanelSelector id="right-feed-panel-settings" value={props.rightPanelType} orientation="right"
          onChange={type => props.updateRightPanel(type)}
        />
      </FeedSettingsContainer>
    </PanelSettingsContainer>
  </SettingsForm>
;

export default FeedSettings;
