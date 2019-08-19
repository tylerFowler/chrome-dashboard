import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FeedType } from '../../../reddit/interface';
import { PanelOrientation, SubredditFeedSettings } from '../../interface';
import { SettingField, SettingInlineLabel, SettingSelect, SettingInput } from '../SettingsForm';
import PanelThemeInput from '../PanelThemeInput';
import { GlobalState } from '../../../store';
import { getPanelFeedSettings } from '../../selectors';
import { updatePanelConfig } from '../../actions';

export interface SubredditSettingsProps {
  readonly panelOrientation: PanelOrientation;
}

const SubredditSettings: React.FC<{ readonly panelOrientation: PanelOrientation }> = ({ panelOrientation }) => {
  const dispatch = useDispatch();
  const feedSettings =
    useSelector((state: GlobalState) => getPanelFeedSettings(panelOrientation, state)) as SubredditFeedSettings;

  const updateFeedSettings = <T extends keyof SubredditFeedSettings>(key: T, value: SubredditFeedSettings[T]) =>
    dispatch(updatePanelConfig(panelOrientation, { ...feedSettings, [key]: value }));

  const makeId = (id: string) => `${id}-${panelOrientation}`;

  // TODO: when sub name is filled out, attempt a request to the subreddit and report any 404 errors
  //       and attempt to find a theme color for the sub, using that as the theme color
  //       - if we do this, just use local state for settings changes and commit only when a request has been made
  //         successfully, only problem here being the issue of the 'Too Many Requests' error
  // TODO: pull out the feed type options into generic component, will need it again later
  // TODO: add input for display name, use the request data to fill out the full subreddit name by default
  return (<>
    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-name')}>Sub Name:</SettingInlineLabel>
      <SettingInput id={makeId('subreddit-name')} value={feedSettings.sub}
        onChange={e => updateFeedSettings('sub', e.target.value)}
      />
    </SettingField>

    <SettingField>
      <SettingInlineLabel htmlFor={makeId('default-subreddit-feed-type')}>Default Feed Type:</SettingInlineLabel>
      <SettingSelect id={makeId('default-subreddit-feed-type')} value={feedSettings.defaultFeedType}
        onChange={e => updateFeedSettings('defaultFeedType', e.target.value as FeedType)}
      >
        <option value={FeedType.Top} defaultChecked={true}>top</option>
        <option value={FeedType.New}>new</option>
        <option value={FeedType.Rising}>rising</option>
        <option value={FeedType.Hot}>hot</option>
        <option value={FeedType.Controversial}>controversial</option>
      </SettingSelect>
    </SettingField>

    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-panel-theme-color')}>Theme:</SettingInlineLabel>
      <PanelThemeInput id={makeId('subreddit-panel-theme-color')} value={feedSettings.theme}
        onChange={theme => updateFeedSettings('theme', theme)}
      />
    </SettingField>
  </>);
};

export default SubredditSettings;
