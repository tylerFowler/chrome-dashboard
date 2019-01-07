import styled from 'panel/styled-components';
import React from 'react';
import FeedItem, { FeedItemProps } from './FeedItem';
import Panel, { PanelProps } from './Panel';

export interface FeedProps extends PanelProps {
  placeholder?: never;
}

const FeedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 2em .75em 1em;
  overflow: scroll;

  li { margin-bottom: 1em; }
`;

const feedData: FeedItemProps[] = [
  { index: 1, title: 'New logo for city of Houston (USA)',
    upvotes: 13, author: 'Catalin Cimpanu', commentCount: 8 },
  { index: 2, title: 'Site Design: Barcamp Omaha',
    upvotes: 4, author: 'Alex Van-Buren', commentCount: 4 },
  { index: 3, title: 'Rio 2016 Olympics Branding',
    upvotes: 7, author: 'Catalin Campanu', commentCount: 6 },
  { index: 4, title: 'Ask DN: What side projects are you working on this weekend?',
    upvotes: 11, author: 'Jonathan Svrdn', commentCount: 49, commentLink: 'https://google.com' },
  { index: 5, title: 'The climate movements needs rebranding, but these Milton House cookies are too good',
    upvotes: 4, author: 'Mark Massie', commentCount: 1 },
];

export default class FeedPanel extends React.Component<FeedProps> {
  public render() {
    const { ...panelProps } = this.props;

    const itms = feedData.map(itm => <li key={itm.index}>
      <FeedItem {...itm} />
    </li>);

    return (
      <Panel {...panelProps}>
        <FeedList>
          {itms}
        </FeedList>
      </Panel>
    );
  }
}
