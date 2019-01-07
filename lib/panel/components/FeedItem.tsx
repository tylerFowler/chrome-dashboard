import styled from 'panel/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';

export interface FeedItemProps {
  readonly index: number;
  readonly title: string;
  readonly maxTitleLength?: number;
  readonly upvotes?: number;
  readonly author?: string;
  readonly commentCount?: number;
  readonly commentLink?: string;
}

const feedItemSize = 80;
const Article = styled.article`
  overflow: hidden;
  clear: both;
  position: relative;

  background-color: ${props => props.theme.backgroundExtraLight};
  height: ${feedItemSize}px;
  max-height: ${feedItemSize}px;
`;

const FeedNumber = styled.span`
  float: left;
  display: inline-block;
  width: ${feedItemSize}px;
  min-width: ${feedItemSize}px;
  height: ${feedItemSize}px;
  min-height: ${feedItemSize}px;

  background-color: ${props => props.theme.primaryColor};

  text-align: center;
  line-height: ${feedItemSize}px;
  font-family: ${fontStacks.Montserrat};
  font-size: ${typeScale(10)};
  color: ${props => props.theme.fontColor};
`;

const ContentContainer = styled.div`
  display: inline-block;
  box-sizing: border-box;
  padding: .25em .75em;
  width: calc(100% - ${feedItemSize}px);
  height: 100%;
  line-height: 1.45;

  font-family: ${fontStacks.Lora};
  font-size: ${typeScale(4)};
`;

const ItemDetail = styled.div`
  font-family: ${fontStacks.OpenSans};
  font-weight: 300;
  font-size: ${typeScale(3)};

  position: absolute;
  bottom: .5em;

  span, a {
    margin: 0 .25em;
  }
`;

const FeedItem: React.FC<FeedItemProps> = props => {
  const {
    index, title, maxTitleLength, upvotes, author, commentCount, commentLink,
  } = props;

  let abbreviatedTitle = title;
  if (title.length > maxTitleLength) {
    abbreviatedTitle = `${title.slice(0, 55)}...`;
  }

  let commentDetail = <span>{commentCount} comments</span>;
  if (commentLink) {
    commentDetail = <a href={commentLink}>{commentCount} comments</a>;
  }

  // TODO include the upvote icon
  return (
    <Article>
      <FeedNumber>{index}</FeedNumber>
      <ContentContainer>
        {abbreviatedTitle}

        <ItemDetail>
          {upvotes && <span>{upvotes}</span>}
          {author && <span>{author}</span>}
          {(upvotes || author) && '|'}
          {commentCount && commentDetail}
        </ItemDetail>
      </ContentContainer>
    </Article>
  );
};

FeedItem.defaultProps = {
  maxTitleLength: 55,
};

export default FeedItem;
