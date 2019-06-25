import styled, { keyframes } from 'styled-components';

const spinAnim = keyframes`
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
`;

export interface SpinnerProps {
  readonly spinnerSize?: string;
  readonly rotationTime?: string;
  readonly spinning?: boolean;
}

const Spinner = styled.img.attrs((props: SpinnerProps) => ({
  src: 'assets/loading-spinner.svg',
  spinnerSize: props.spinnerSize || '1.25rem',
  rotationTime: props.rotationTime || '1s',
  spinning: props.spinning === undefined ? true : props.spinning,
}))`
  width: ${props => props.spinnerSize};
  height: ${props => props.spinnerSize};

  animation: ${spinAnim} ${props => props.rotationTime} infinite linear;
  animation-play-state: ${props => props.spinning ? 'running' : 'paused'};
`;

Spinner.defaultProps = {
  spinnerSize: '1.25rem',
};

export default Spinner;
