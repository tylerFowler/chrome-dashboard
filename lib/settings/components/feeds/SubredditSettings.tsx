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

  const makeId = (id: string) => `${id}-${panelOrientation}`;

  // TODO: when sub name is filled out, attempt a request to the subreddit and report any 404 errors
  //       and attempt to find a theme color for the sub, using that as the theme color
  // TODO: pull out the feed type options into generic component, will need it again later
  // TODO: add input for display name, use the request data to fill out the full subreddit name by default
  return (<>
    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-name')}>Sub Name:</SettingInlineLabel>
      <SettingInput id={makeId('subreddit-name')} value="" />
    </SettingField>

    <SettingField>
      <SettingInlineLabel htmlFor={makeId('default-subreddit-feed-type')}>Default Feed Type:</SettingInlineLabel>
      <SettingSelect id={makeId('default-subreddit-feed-type')} value="">
        <option value={FeedType.Top} defaultChecked={true}>top</option>
        <option value={FeedType.New}>new</option>
        <option value={FeedType.Rising}>rising</option>
        <option value={FeedType.Hot}>hot</option>
        <option value={FeedType.Controversial}>controversial</option>
      </SettingSelect>
    </SettingField>

    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-panel-theme-color')}>Theme:</SettingInlineLabel>
      <PanelThemeInput id={makeId('subreddit-panel-theme-color')} />
    </SettingField>
  </>);
};

export default SubredditSettings;
