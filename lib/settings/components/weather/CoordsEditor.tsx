import React, { useContext } from 'react';
import styled from 'styled-components';
import { SettingField, SettingLabel, SettingInput } from '../SettingsForm';
import LocationEditorDispatch from './locationEditorDispatch';

export interface CoordsEditorProps {
  readonly lat: string;
  readonly lon: string;
  readonly displayName: string;
}

const CoordInput = styled(SettingInput)`
  width: 7em;
`;

const CoordsEditor: React.SFC<CoordsEditorProps> = ({ lat, lon, displayName }) => {
  const dispatch = useContext(LocationEditorDispatch);

  const updateCoords = ({ newLat = lat, newLon = lon }) =>
    dispatch({ type: 'updateCoords', payload: `${newLat},${newLon}` });

  return (<>
    <SettingField>
      <SettingLabel htmlFor="weather-loc-lat">Latitude</SettingLabel>
      <CoordInput id="weather-loc-lat" value={lat}
        onChange={e => updateCoords({newLat: e.target.value})}
      />
    </SettingField>

    <SettingField>
      <SettingLabel htmlFor="weather-loc-lon">Longitude</SettingLabel>
      <CoordInput id="weather-loc-lon" value={lon}
        onChange={e => updateCoords({newLon: e.target.value})}
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

export default CoordsEditor;
