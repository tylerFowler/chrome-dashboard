import React from 'react';
import { FeedType } from '../interface';

const FeedSelectOptions: React.SFC = () => {
  return (
    <>
      <option value={FeedType.TopStories} defaultChecked={true}>top</option>
      <option value={FeedType.NewStories}>new</option>
      <option value={FeedType.BestStories}>best</option>
      <option value={FeedType.ShowStories}>show</option>
    </>
  );
};

export default FeedSelectOptions;
