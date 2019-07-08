import React, { useState, useEffect, useContext } from 'react';

// configuration for using breakpoints in React components, contains specifications
// that are implicit in LayoutBreakpoint items
export interface BreakpointConfig {
  L: number;
  M: number;
  S: number;
}

// useBreakpoint watches for transitions from one given breakpoint to another
// using browser media query lists
export function useBreakpoint(breakpoints: BreakpointConfig): keyof BreakpointConfig {
  const breakpointMatches: { [key in keyof BreakpointConfig]: MediaQueryList } = {
    L: window.matchMedia(`(min-width: ${breakpoints.L}px)`),
    M: window.matchMedia(`(max-width: ${breakpoints.L}px) and (min-width: ${breakpoints.M}px)`),
    S: window.matchMedia(`(max-width: ${breakpoints.S}px)`),
  };

  const defaultValue = Object.entries(breakpointMatches)
    .reduce((match, [ bp, mql ]) => mql.matches ? bp : match, 'L') as keyof BreakpointConfig;

  const [ breakpoint, setBreakpoint ] = useState<keyof BreakpointConfig>(defaultValue);

  useEffect(() => {
    const makeHandler = (size: keyof BreakpointConfig) => (event: MediaQueryListEvent) => {
      if (event.matches) {
        setBreakpoint(size);
      }
    };

    const subscriptions = Object.entries(breakpointMatches)
      .map(([ bp, mql ]: [ keyof BreakpointConfig, MediaQueryList ]) => {
        const handlerFunc = makeHandler(bp);

        mql.addListener(handlerFunc);
        return [ bp, handlerFunc ] as [ keyof BreakpointConfig, (e: MediaQueryListEvent) => void ];
      });

    return () => {
      subscriptions.forEach(([ bp, handlerFunc ]) => breakpointMatches[bp].removeListener(handlerFunc));
    };
  });

  return breakpoint;
}

export const BreakpointContext = React.createContext<keyof BreakpointConfig>('L');

// AtSizes is a HOC that will only display its children when one of the required
// breakpoints are active, otherwise hiding its children while keeping them "rendered"
// from React's point of view for optimal performance.
//
// TODO: move this to its own file along with the breakpoint hook
export const AtSizes: React.FC<{
  readonly breakpoints: Array<keyof BreakpointConfig>,
}> = ({ breakpoints = [], children }) => {
  const breakpoint = useContext(BreakpointContext);

  const display = breakpoints.find(bp => bp === breakpoint)
    ? 'contents' // don't affect the layout at all, making this a visual no-op
    : 'none';    // don't show the element at all but allow React to keep it rendered

  return <span style={{display}}>{children}</span>;
};
