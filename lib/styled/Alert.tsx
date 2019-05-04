import styled from 'lib/styled-components';

export const Error = styled.aside`
  border-radius: 2px;
  padding: .25rem 1em .25rem .5em;

  background-color: ${props => props.theme.negativeBackground};
  color: ${props => props.theme.negativeAccent};
  border-bottom: 4px solid ${props => props.theme.negativeAccent};
`;
