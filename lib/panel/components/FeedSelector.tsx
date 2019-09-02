import React from 'react';
import styled from 'lib/styled-components';
import { PanelOrientation } from 'lib/settings/interface';
import Select from '../../styled/Select';

export interface FeedSelectorProps {
  readonly orientation: PanelOrientation;
  readonly feed?: string;
  onChange?(feed: string): void;
}

const FeedSelectContainer = styled.div<{ readonly orientation: string }>`
  padding: 0 .5em;

  text-align: ${props => props.orientation === 'left'
    ? 'left'
    : 'right'
  }
`;

const FeedSelector: React.SFC<FeedSelectorProps> = ({ orientation, feed, onChange = () => {}, children }) =>
  <FeedSelectContainer orientation={orientation}>
    <Select value={feed} onChange={e => onChange(e.target.value)}>
      {children}
    </Select>
  </FeedSelectContainer>
;

export default FeedSelector;
