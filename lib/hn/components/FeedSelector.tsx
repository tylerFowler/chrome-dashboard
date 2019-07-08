import React from 'react';
import styled from 'lib/styled-components';
import { PanelOrientation } from 'lib/settings/interface';
import { FeedType } from '../interface';
import FeedOptionGroup from './FeedOptionGroup';
import Select from '../../styled/Select';

export interface FeedSelectorProps {
  readonly orientation: PanelOrientation;
  readonly feed?: FeedType;
  onChange?(feed: FeedType): void;
}

const FeedSelectContainer = styled.div<{ readonly orientation: string }>`
  padding: 0 .5em;

  text-align: ${props => props.orientation === 'left'
    ? 'left'
    : 'right'
  }
`;

const FeedSelector: React.SFC<FeedSelectorProps> = ({
  orientation, feed = FeedType.NewStories,
  onChange = () => {},
}) =>
  <FeedSelectContainer orientation={orientation}>
    <Select value={feed} onChange={e => onChange(e.target.value as FeedType)}>
      <FeedOptionGroup />
    </Select>
  </FeedSelectContainer>
;

export default FeedSelector;
