import React, { useContext } from 'react';
import LocationEditorDispatch from './locationEditorDispatch';
import { SettingField, SettingLabel, SettingInput } from '../SettingsForm';

export interface ZIPCodeEditorProps {
  readonly zip: string;
  readonly countryCode: string;
  readonly displayName?: string;
}

const ZIPCodeEditor: React.SFC<ZIPCodeEditorProps> = ({ zip, countryCode, displayName }) => {
  const dispatch = useContext(LocationEditorDispatch);

  return (<>
    <SettingField>
      <SettingLabel htmlFor="weather-loc-zipcode">ZIP Code</SettingLabel>
      <SettingInput id="weather-loc-zipcode" type="postal-code" value={zip}
        onChange={e => dispatch({ type: 'updateZipCode', payload: e.target.value })}
      />
    </SettingField>

    <SettingField>
      <SettingLabel htmlFor="weather-loc-country-code">Country Code</SettingLabel>
      <SettingInput id="weather-loc-country-code" type="country" value={countryCode}
        placeholder="ex: US, UK"
        onChange={e => dispatch({ type: 'updateCountryCode', payload: e.target.value })}
      />
    </SettingField>

    <SettingField>
      <SettingLabel htmlFor="weather-loc-display-name">Display Name</SettingLabel>
        <SettingInput id="weather-loc-display-name" value={displayName}
          onChange={e => dispatch({ type: 'updateDisplayName', payload: e.target.value })}
        />
    </SettingField>
  </>);
};

export default ZIPCodeEditor;
