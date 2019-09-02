import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'lib/styled-components';
import Select from './styled/Select';
import { getFeedName } from './settings/selectors';
import { GlobalState } from './store';

const PanelPicker = styled.span`
  display: block;
  text-align: center;
  margin: .5em auto;
`;

const PrimaryPanelPicker: React.FC<{ panel: 'left'|'right', onChange(p: 'left'|'right'): void }> = ({
  panel, onChange,
}) => {
  const leftPanelName = useSelector((state: GlobalState) => getFeedName('left', state));
  const rightPanelName = useSelector((state: GlobalState) => getFeedName('right', state));

  return (
    <PanelPicker>
      <Select name="primary-panel-select" value={panel}
        onChange={e => onChange(e.currentTarget.value as 'left'|'right')}
        style={{display: 'inline-block'}}
      >
        <option value="left">{leftPanelName}</option>
        <option value="right" defaultChecked>{rightPanelName}</option>
      </Select>
    </PanelPicker>
  );
};

export default PrimaryPanelPicker;
