import React from 'react';
import styled from 'styled-components';
import { fontStacks, typeScale } from 'lib/styles';

const StyledLocation = styled.h1`
  text-align: center;
  font-family: ${fontStacks.OpenSans};
  font-weight: 200;
  overflow-wrap: break-word;

  margin: 0 auto 1rem;
`;

// SizeAdjustedLocation is a component that displays a weather location, adjusting
// the font size of the location according to the length of the inner content,
// which must be a string.
const SizeAdjustedLocation: React.SFC<{ readonly children: string }> = ({ children }) => {
  // use larger location font sizes for smaller display names
  let locationFontSize = typeScale(8);
  if (children.length < 6) {
    locationFontSize = typeScale(11);
  } else if (children.length < 12) {
    locationFontSize = typeScale(10);
  }

  return <StyledLocation style={{fontSize: locationFontSize}}>{children}</StyledLocation>;
};

export default SizeAdjustedLocation;
