import React from 'react';
import { FeedType } from '../interface';

const FeedOptionGroup: React.FC = () => <>
  <option value={FeedType.Top} defaultChecked={true}>top</option>
  <option value={FeedType.New}>new</option>
  <option value={FeedType.Rising}>rising</option>
  <option value={FeedType.Hot}>hot</option>
  <option value={FeedType.Controversial}>controversial</option>
</>;

export default FeedOptionGroup;
