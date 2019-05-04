import React, { useContext } from 'react';
import { SettingField, SettingLabel, SettingInput } from '../SettingsForm';
import LocationEditorDispatch from './locationEditorDispatch';

export interface CityLocationEditorProps {
  readonly cityName: string;
  readonly displayName?: string;
  readonly countryCode: string;
}

const CityLocationEditor: React.SFC<CityLocationEditorProps> = props => {
  const dispatch = useContext(LocationEditorDispatch);

  return (
    <>
      <SettingField>
        <SettingLabel htmlFor="weather-loc-city-name">City</SettingLabel>
        <SettingInput id="weather-loc-city-name" value={props.cityName}
          onChange={e => dispatch({ type: 'updateCity', payload: e.target.value })}
        />
      </SettingField>

      <SettingField>
        <SettingLabel htmlFor="weather-loc-display-name">Display Name</SettingLabel>
        <SettingInput id="weather-loc-display-name" value={props.displayName || ''}
          onChange={e => dispatch({ type: 'updateDisplayName', payload: e.target.value })}
        />
      </SettingField>

      <SettingField>
        <SettingLabel htmlFor="weather-loc-country-code">Country Code</SettingLabel>
        <SettingInput id="weather-loc-country-code" value={props.countryCode || 'US'}
          onChange={e => dispatch({ type: 'updateCountryCode', payload: e.target.value })}
        />
      </SettingField>
    </>
  );
};

export default CityLocationEditor;
