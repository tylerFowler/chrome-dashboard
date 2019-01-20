import styled from 'panel/styled-components';
import React from 'react';

export const UpvoteIcon = styled('div')<{hasUpvoteHandler: boolean}>`
  display: inline-block;
  vertical-align: baseline;
  height: 0;
  width: 0;
  margin: 0 .5em 0 0;

  ${props => props.hasUpvoteHandler && 'cursor: pointer'};

  border-top: .65em solid transparent;
  border-right: .5em solid transparent;
  border-left: .5em solid transparent;
  border-bottom: .65em solid ${props => props.theme.backgroundDark};
`;

const Upvotes: React.FC<{ count: number, upvote?: () => void }> = ({ count, upvote }) =>
  <span onClick={upvote}>
    {count} <UpvoteIcon hasUpvoteHandler={upvote !== void 0} />
  </span>
;

export default Upvotes;
