import { RGB } from '../../panel/panelTheme';
import styled, { keyframes } from '../styled-components';

export interface SpinnerProps {
  readonly sizePx?: number;
  readonly radius?: string;
  readonly fadeinSpeed?: string;
  readonly topMargin?: string;
}

const rgba = ({ red, green, blue }: RGB, alpha: number) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`
;

const outerRingFadein = keyframes`
  0% { opacity: 0; transform: scale3d(0, 0, 0); }
  100% { opacity: 1; transform: scale3d(1, 1, 1); }
`;

const spinnerFadein = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const spinAnim = keyframes`
  100% { transform: rotate3d(0, 0, 1, 1turn); }
`;

export default styled('div').attrs({
  sizePx: 8,
  radius: '32px',
  fadeinSpeed: '.35s',
})<SpinnerProps>`
  height: ${props => props.radius};
  width: ${props => props.radius};

  margin: auto;
  position: relative;
  top: ${props => props.topMargin || '0'};

  &::before, &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
  }

  &::before {
    top: 50%;
    left: ${props => -(props.sizePx + 1)}px;
    margin: ${props => props.sizePx / 2}px 0 0;
    width: ${props => props.sizePx}px;
    height: ${props => props.sizePx}px;
    background: ${props => rgba(props.theme.primaryColorRGB, .9)};
    opacity: 0;
    transform-origin: ${props => props.radius} 50%;

    animation-name: ${spinnerFadein}, ${spinAnim};
    animation-delay: calc(${props => props.fadeinSpeed} + .075s);
    animation-duration: .15s, 1s;
    animation-iteration-count: 1, infinite;
    animation-timing-function: ease-in, linear;
    animation-fill-mode: forwards;
  }

  &::after {
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px; /* TODO make func of size */
    width: 50px;
    height: 50px;
    opacity: 1;

    border: ${props => props.sizePx}px solid ${props => rgba(props.theme.primaryColorRGB, .1)};
    animation: ${outerRingFadein} ${props => props.fadeinSpeed} ease-in 1;
  }
`;
