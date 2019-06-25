import React from 'react';
import styled from 'lib/styled-components';
import { PanelOrientation } from 'lib/settings/interface';
import { FeedType } from '../interface';
import FeedOptionGroup from './FeedOptionGroup';

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

  :after {
    content: '';
    display: inline-block;
    pointer-events: none;

    vertical-align: middle;
    width: .35em;
    height: .35em;

    border-bottom: 2px solid ${props => props.theme.backgroundDarker};
    border-right: 2px solid ${props => props.theme.backgroundDarker};
    transform: rotate(45deg);
  }
`;

const FeedSelect = styled.select`
  cursor: pointer;
  appearance: none;
  background: none;
  border: 0;
  outline: 0;

  vertical-align: middle;
  padding-right: 1.68em;
  margin-right: -1.25em;
`;

const FeedSelector: React.SFC<FeedSelectorProps> = ({
  orientation, feed = FeedType.NewStories,
  onChange = () => {},
}) =>
  <FeedSelectContainer orientation={orientation}>
    <FeedSelect value={feed} onChange={e => onChange(e.target.value as FeedType)}>
      <FeedOptionGroup />
    </FeedSelect>
  </FeedSelectContainer>
;

export default FeedSelector;
