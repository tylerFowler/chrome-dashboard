import React from 'react';
import styled from 'lib/styled-components';

const SelectContainer = styled.div`
  :after {
    content: '';
    display: inline-block;
    pointer-events: none;

    vertical-align: middle;
    width: .35em;
    height: .35em;

    border-bottom: 2px solid ${props => props.theme.backgroundDarker};
    border-right: 2px solid ${props => props.theme.backgroundDarker};
    transform: rotate(45deg);
  }
`;

const StyledSelect = styled.select`
  cursor: pointer;
  appearance: none;
  background: none;
  border: 0;
  outline: 0;

  vertical-align: middle;
  padding-right: 1.68em;
  margin-right: -1.25em;
`;

// Select is a component that is a drop-in replacement for <select> with a custom
// dropdown icon.
const Select: React.FC<React.InputHTMLAttributes<HTMLSelectElement>> = ({
  style, className, children, ...selectProps
}) =>
  <SelectContainer style={style} className={className}>
    <StyledSelect {...selectProps}>{children}</StyledSelect>
  </SelectContainer>
;

export default Select;
