import styled, { keyframes } from 'panel/styled-components';
import React from 'react';
import ErrorDisplay from './ErrorDisplay';
import Panel, { PanelProps } from './Panel';
import Spinner from './Spinner';
import { PanelOrientation } from '../../settings/interface';

export interface FeedProps extends PanelProps {
  placeholder?: never;
  loading?: boolean;
  fetchError?: Error;

  // space for a single line is allocated for arbitrary feed controls, which
  // can be rendered using this prop
  renderFeedControls?(orientation: PanelOrientation): React.ReactElement;
}

const feedHorizPadding = '.75em' as const;

const feedListScrollIn = keyframes`
  from { transform: translateY(100vh); }
  to { transform: translateY(0); }
`;

const FeedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: .5em ${feedHorizPadding} 1em;

  > li {
    margin-bottom: 1em;

    animation: ${feedListScrollIn} 1.5s cubic-bezier(0.43, 0.11, 0.48, 1.11);
  }
`;

const FeedControlsContainer = styled.aside`
  height: 1em;
  padding: .5em ${feedHorizPadding};
`;

const FeedPanel: React.SFC<FeedProps> = props => {
  const {
    loading, fetchError, children,
    renderFeedControls,
    ...panelProps
  } = props;

  return (
    <Panel {...panelProps}>
      {loading && <Spinner topMargin="30%" />}

      {fetchError &&
        <ErrorDisplay>
          Error loading feed<br />
          <em>{fetchError.message}</em>
        </ErrorDisplay>
      }

      {!loading && !fetchError && <>
        <FeedControlsContainer>
          {renderFeedControls(props.panelOrientation)}
        </FeedControlsContainer>

        <FeedList>
          {children}
        </FeedList>
      </>}
    </Panel>
  );
};

FeedPanel.defaultProps = {
  loading: false,
  fetchError: null,
  renderFeedControls: () => <></>,
};

export default FeedPanel;
