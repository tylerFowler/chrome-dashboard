import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'lib/styled-components';
import { FeedType } from './settings/interface';
import { getLeftPanelFeedType, getRightPanelFeedType } from './settings/selectors';
import Select from './styled/Select';

const PanelPicker = styled.span`
  display: block;
  text-align: center;
  margin: .5em auto;
`;

const PrimaryPanelPicker: React.FC<{ panel: 'left'|'right', onChange(p: 'left'|'right'): void }> = ({
  panel, onChange,
}) => {
  let leftPanelName = FeedType.getDisplayString(useSelector(getLeftPanelFeedType));
  const rightPanelName = FeedType.getDisplayString(useSelector(getRightPanelFeedType));

  if (leftPanelName === rightPanelName) {
    leftPanelName += ' - Left';
  }

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
