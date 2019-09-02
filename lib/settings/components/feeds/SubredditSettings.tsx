import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '../../../store';
import { updatePanelConfig } from '../../actions';
import { getPanelFeedSettings } from '../../selectors';
import { FeedType } from '../../../reddit/interface';
import defaultRedditTheme from '../../../reddit/theme';
import FeedOptionGroup from '../../../reddit/components/FeedOptionGroup';
import { PanelOrientation, SubredditFeedSettings } from '../../interface';
import PanelThemeInput from '../PanelThemeInput';
import { SettingField, SettingInlineLabel, SettingSelect, SettingInput, SettingLinkButton } from '../SettingsForm';

const defaultSettings: Partial<SubredditFeedSettings> = {
  defaultFeedType: FeedType.Top,
  theme: defaultRedditTheme,
} as const;

const SubredditSettings: React.FC<{ readonly panelOrientation: PanelOrientation }> = ({ panelOrientation }) => {
  const dispatch = useDispatch();
  const feedSettings =
    useSelector((state: GlobalState) => getPanelFeedSettings(panelOrientation, state)) as SubredditFeedSettings;

  const updateFeedSettings = <T extends keyof SubredditFeedSettings>(key: T, value: SubredditFeedSettings[T]) =>
    dispatch(updatePanelConfig(panelOrientation, { ...feedSettings, [key]: value }));

  useEffect(() => {
    if (Object.keys(feedSettings).length === 0) {
      dispatch(updatePanelConfig(panelOrientation, defaultSettings));
    }
  }, []);

  // the subreddit needs local state that is only "committed" to settings when the
  // user is done with it to avoid trying to fetch all of their intermediate input,
  // "done with it" here meaning the blur event or the enter key being pressed
  const [ subreddit, setSubreddit ] = useState(feedSettings.sub);

  const makeId = (id: string) => `${id}-${panelOrientation}`;

  return (<>
    <SettingField>
      <SettingInlineLabel htmlFor={makeId('subreddit-name')}>Sub Name:</SettingInlineLabel>
      <SettingInput id={makeId('subreddit-name')} value={subreddit} placeholder="r/sub"
        onChange={e => setSubreddit(e.target.value)}
        onBlur={() => subreddit.length > 0 && updateFeedSettings('sub', subreddit)}
        onKeyPress={e => e.key === 'Enter' && updateFeedSettings('sub', subreddit)}
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
      <PanelThemeInput id={makeId('subreddit-panel-theme-color')} value={feedSettings.theme || defaultRedditTheme}
        onChange={theme => updateFeedSettings('theme', theme)}
      />

      <SettingLinkButton onClick={e => {
          e.preventDefault();
          updateFeedSettings('theme', defaultRedditTheme);
        }} style={{marginLeft: '.5em'}}
      >
        reset
      </SettingLinkButton>
    </SettingField>
  </>);
};

export default SubredditSettings;
