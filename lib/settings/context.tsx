import React from 'react';
import { connect } from 'react-redux';
import { HNFeedSettings, PanelOrientation } from './interface';
import { FeedType } from '../hn/interface';
import { GlobalState } from '../store';
import { getPanelFeedSettings } from './selectors';

// SettingsProviderProps is the set of properties given to each Settings Provider
// component, which supplies arbitrary settings over a context provider, optionally,
// where applicable, the orientation of the parent panel.
export interface SettingsProviderProps<T> {
  readonly settings: T;
  readonly orientation?: PanelOrientation;
}

// SettingsSelector is a Redux selector function that should be used to retrieve
// the settings state that a settings provider gives through it's source context.
type SettingsSelector<T> = (state: GlobalState, orientation: PanelOrientation) => T;

// createSettingsProvider creates a connected Context provider that provides it's
// particular settings to the React tree, using a settingsSelector and optionally
// an orientation. Note that the second value of the generic is only present to satisfy
// the TSX parser, if given only one generic it will think that it's a ReactElement.
const createSettingsProvider = <T, _ = any>(settingsSelector: SettingsSelector<T>, context: React.Context<T>) =>
  connect(
    (state: GlobalState, ownProps: Partial<Pick<SettingsProviderProps<T>, 'orientation'>>): SettingsProviderProps<T> =>
      ({ ...ownProps,
        settings: settingsSelector(state, ownProps.orientation),
      }),
  )(({ settings, children }) => <context.Provider value={settings}>{children}</context.Provider>)
;

export const HNSettingsContext = React.createContext<HNFeedSettings>({
  defaultFeedType: FeedType.NewStories,
});

export const HNFeedSettingsProvider = createSettingsProvider(
  (state, orientation) => getPanelFeedSettings(orientation, state),
  HNSettingsContext,
);
