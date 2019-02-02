import styled from 'lib/styled-components';
import React from 'react';
import CloseIcon from './CloseIcon';

export interface PanelProps {
  onClose?(): void;
}

const ModalContainer = styled.div`
  z-index: 999;
  position: absolute;
  width: 750px;
  height: 500px;
  margin: auto;
  left: 0; right: 0; top: 0; bottom: 0;

  padding: 1em;

  border: 1px solid black;
  background-color: ${props => props.theme.backgroundLight};
`;

export default class Panel extends React.Component<PanelProps> {
  public render() {
    return (
      <ModalContainer>
        Settings

        <CloseIcon onClick={() => this.props.onClose()} />
      </ModalContainer>
    );
  }
}
