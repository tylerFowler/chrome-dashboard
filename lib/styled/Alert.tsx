import styled from 'lib/styled-components';

const BaseAlert = styled.aside`
  border-radius: 2px;
  padding: .25rem 1em .25rem .5em;

  background-color: ${props => props.theme.backgroundLightDark};
  border-bottom: 4px solid ${props => props.theme.backgroundDark};
`;

export const Error = styled(BaseAlert)`
  background-color: ${props => props.theme.negativeBackground};
  color: ${props => props.theme.negativeAccent};
  border-bottom-color: ${props => props.theme.negativeAccent};
`;

export const Warning = styled(BaseAlert)`
  background-color: ${props => props.theme.warningBackground};
  color: ${props => props.theme.warningAccent};
  border-bottom-color: ${props => props.theme.warningAccent};
`;
