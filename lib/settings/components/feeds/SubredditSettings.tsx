import React from 'react';
import { FeedType } from '../../../reddit/interface';
import { PanelOrientation } from '../../interface';
import { SettingField, SettingInlineLabel, SettingSelect, SettingInput } from '../SettingsForm';
import PanelThemeInput from '../PanelThemeInput';

export interface SubredditSettingsProps {
  readonly panelOrientation: PanelOrientation;
}

const SubredditSettings: React.FC<{ readonly panelOrientation: PanelOrientation }> = ({ panelOrientation }) => {
  // TODO: get the current values from settings state, ignore the setters - we'll only dispatch things

  // TODO: add id's to these, going to have to make a func called makeId that appends the orientation
  // TODO: when sub name is filled out, attempt a request to the subreddit and report any 404 errors
  //       and attempt to find a theme color for the sub, using that as the theme color
  // TODO: pull out the feed type options into generic component, will need it again later
  // TODO: add input for display name, use the request data to fill out the full subreddit name by default
  return (<>
    <SettingField>
      <SettingInlineLabel>Sub Name:</SettingInlineLabel>
      <SettingInput value="" />
    </SettingField>

    <SettingField>
      <SettingInlineLabel>Default Feed Type:</SettingInlineLabel>
      <SettingSelect value="">
        <option value={FeedType.Top} defaultChecked={true}>top</option>
        <option value={FeedType.New}>new</option>
        <option value={FeedType.Rising}>rising</option>
        <option value={FeedType.Hot}>hot</option>
        <option value={FeedType.Controversial}>controversial</option>
      </SettingSelect>
    </SettingField>

    <SettingField>
      <SettingInlineLabel>Theme:</SettingInlineLabel>
      <PanelThemeInput />
    </SettingField>
  </>);
};

export default SubredditSettings;
