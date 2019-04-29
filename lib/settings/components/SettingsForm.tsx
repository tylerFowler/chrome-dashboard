import styled from 'lib/styled-components';
import { fontStacks, typeScale } from '../../styles';

export const SettingField = styled.div`
  font-size: ${typeScale(3)};
  margin: 1.5em auto;

  &:first-of-type { margin-top: 0; }
`;

export const SettingFieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  > ${SettingField} {
    margin: .5em 1em;

    &:first-of-type { margin-left: 0; }
  }
`;

export const SettingLabel = styled.label`
  display: block;
  margin-bottom: .75em;
`;

export const SettingInlineLabel = styled(SettingLabel)`display: inline-block`;

export const SettingInput = styled.input`
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

export default styled.form`
  font-family: ${fontStacks.Monospace};

  legend {
    font-size: ${typeScale(5)};
    margin-bottom: 1rem;
  }
`;
