import styled from 'panel/styled-components';
import React from 'react';
import Panel, { PanelProps } from './Panel';
import Spinner from './Spinner';

export interface FeedProps extends PanelProps {
  placeholder?: never;
  loading?: boolean;
  fetchError: Error;
}

const FeedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 2em .75em 1em;
  overflow: scroll;

  li { margin-bottom: 1em; }
`;

export default class FeedPanel extends React.Component<FeedProps> {
  public render() {
    const { loading, fetchError, children, ...panelProps } = this.props;

    return (
      <Panel {...panelProps}>
        {loading && <Spinner topMargin="30%" />}

        {!loading &&
          <FeedList>
            {fetchError && <span>Error: {fetchError.toString()}</span>}
            {children}
          </FeedList>
        }
      </Panel>
    );
  }
}
