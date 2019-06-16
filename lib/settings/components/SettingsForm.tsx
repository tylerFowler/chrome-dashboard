import styled from 'lib/styled-components';
import { fontStacks, typeScale } from '../../styles';

export const SettingField = styled.div`
  margin: 1.5em auto;

  &:first-of-type { margin-top: 0; }
`;

export const SettingFieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  > ${SettingField} {
    margin: .5em 1.5em .5em 0;

    &:first-of-type { margin-left: 0; }
  }
`;

export const SettingLabel = styled.label`
  display: block;
  margin-bottom: .75em;
`;

export const SettingInlineLabel = styled(SettingLabel)`display: inline-block`;

export const SettingInput = styled.input`
  height: 1.25em;
  padding: .25em .5em;

  border: 1px solid ${props => props.theme.backgroundDarker};
  border-radius: 3px;
  background-color: ${props => props.theme.backgroundExtraLight};
  box-shadow: inset 0 0 3px 0 ${props => props.theme.inputShadowDark};

  &:focus { outline: 0; }

  ${SettingInlineLabel} + & {
    margin-left: 1em;
  }
`;

export const SettingSelect = styled.select`
  &:focus { outline: 0; }

  ${SettingInlineLabel} + & {
    margin-left: 1em;
  }
`;

export const SettingRadio = styled.input.attrs({ type: 'radio' })`
  & + ${SettingInlineLabel} {
    margin-right: 1em;
    margin-left: .5em;
  }
`;

export const SettingButton = styled.button`
  cursor: pointer;
  user-select: none;
  &:focus { outline: 0; }

  font-weight: bold;
  color: ${props => props.theme.typeDark};

  padding: .5em 1em;
  background-color: ${props => props.theme.backgroundExtraLight};
  border-radius: 2px;
  border: 1px solid ${props => props.theme.typeDark};
  box-shadow: inset 0 -.25em ${props => props.theme.borderDarkLight};
  padding-bottom: .65em; // compensate for box shadow

  // covers both the disabled -> enabled and hovered -> not hovered transitions
  transition:
    color 350ms ease-out,
    background-color 350ms ease-out,
    border-color 350ms ease-out,
    box-shadow 350ms ease-out;

  &:hover:not(:disabled), &:focus:not(:disabled) {
    color: ${props => props.theme.typeLightDark};
    box-shadow: inset 0 -20rem ${props => props.theme.borderDarkLight};
    transition:
      color 150ms ease-in 200ms,
      box-shadow 750ms ease-in 125ms;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${props => props.theme.typeDarkLight};
    border-color: ${props => props.theme.typeDarkLight};
    box-shadow: inset 0 -.25em ${props => props.theme.typeDarkLight};

    transition:
      color .35s ease-in,
      border-color .35s ease-in,
      box-shadow .35s ease-in;
  }
`;

export default styled.form`
  font-size: ${typeScale(3)};
  font-family: ${fontStacks.Monospace};

  > fieldset {
    border: 2px solid ${props => props.theme.backgroundDark};
    border-radius: 3px;
  }

  legend {
    font-size: ${typeScale(5)};
    margin-bottom: 1rem;
  }

  button:not(last-of-type) {
    margin-right: 1em;
  }
`;
