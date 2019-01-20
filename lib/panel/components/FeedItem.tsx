import styled from 'panel/styled-components';
import React from 'react';
import { fontStacks, typeScale } from '../../styles';
import Upvotes from './Upvotes';

export interface FeedItemProps {
  readonly id: string|number;
  readonly index: number;
  readonly title: string;
  readonly url: string;
  readonly maxTitleLength?: number;
  readonly upvotes?: number;
  readonly author?: string;
  readonly commentCount?: number;
  readonly commentLink?: string;

  upvote?(id: string|number): void;
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

  user-select: none;
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

  span, a { margin: 0 .125em; }
`;

const Link = styled.a.attrs({
  target: '_blank',
})`
  text-decoration: none;
  color: inherit;
`;

const PostLink = styled(Link)`
  &:visited {
    color: ${props => props.theme.typeDarkLight}
  }
`;

const CommentLink = styled(Link)``;

const FeedItem: React.FC<FeedItemProps> = props => {
  const {
    id, index, title, url, maxTitleLength, upvotes, author,
    commentCount, commentLink, upvote,
  } = props;

  let abbreviatedTitle = title;
  if (title.length > maxTitleLength) {
    abbreviatedTitle = `${title.slice(0, 55)}...`;
  }

  let commentDetail = <span>
    {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
  </span>;

  if (commentLink) {
    commentDetail = <CommentLink href={commentLink}>{commentDetail}</CommentLink>;
  }

  let upvoteHandler;
  if (upvote) {
    upvoteHandler = () => upvote(id);
  }

  return (
    <Article>
      <FeedNumber>{index}</FeedNumber>
      <ContentContainer>
        <PostLink href={url} title={title}>{abbreviatedTitle}</PostLink>

        <ItemDetail>
          {upvotes && <Upvotes count={upvotes} upvote={upvoteHandler} />}
          {author && <span>{author}</span>}
          {(upvotes || author) && <span style={{userSelect: 'none'}}>|</span>}
          {commentCount !== undefined && commentDetail}
        </ItemDetail>
      </ContentContainer>
    </Article>
  );
};

FeedItem.defaultProps = {
  maxTitleLength: 55,
};

export default FeedItem;
