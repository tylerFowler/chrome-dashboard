import styled, { keyframes } from 'panel/styled-components';
import React from 'react';
import ErrorDisplay from './ErrorDisplay';
import Panel, { PanelProps } from './Panel';
import Spinner from './Spinner';

export interface FeedProps extends PanelProps {
  placeholder?: never;
  loading?: boolean;
  fetchError: Error;
}

const feedListScrollIn = keyframes`
  from { transform: translateY(100vh); }
  to { transform: translateY(0); }
`;

export const FeedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 2em .75em 1em;
  overflow: scroll;

  > li {
    margin-bottom: 1em;

    animation: ${feedListScrollIn} 1.5s cubic-bezier(0.43, 0.11, 0.48, 1.11);
  }
`;

export default class FeedPanel extends React.Component<FeedProps> {
  public render() {
    const { loading, fetchError, children, ...panelProps } = this.props;

    return (
      <Panel {...panelProps}>
        {loading && <Spinner topMargin="30%" />}

        {fetchError &&
          <ErrorDisplay>
            Error loading feed<br />
            <em>{fetchError.toString()}</em>
          </ErrorDisplay>
        }

        {!loading && children}
      </Panel>
    );
  }
}
