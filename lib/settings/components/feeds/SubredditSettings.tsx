import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '../../../store';
import { updatePanelConfig } from '../../actions';
import { getPanelFeedSettings } from '../../selectors';
import { FeedType } from '../../../reddit/interface';
import FeedOptionGroup from '../../../reddit/components/FeedOptionGroup';
import { PanelOrientation, SubredditFeedSettings } from '../../interface';
import PanelThemeInput from '../PanelThemeInput';
import { SettingField, SettingInlineLabel, SettingSelect, SettingInput } from '../SettingsForm';

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

  return (<>
    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-name')}>Sub Name:</SettingInlineLabel>
      <SettingInput id={makeId('subreddit-name')} value={feedSettings.sub} placeholder="r/sub"
        onChange={e => updateFeedSettings('sub', e.target.value)}
      />
    </SettingField>

    <SettingField>
      <SettingInlineLabel htmlFor={makeId('default-subreddit-feed-type')}>Default Feed Type:</SettingInlineLabel>
      <SettingSelect id={makeId('default-subreddit-feed-type')} value={feedSettings.defaultFeedType}
        onChange={e => updateFeedSettings('defaultFeedType', e.target.value as FeedType)}
      >
        <FeedOptionGroup />
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
