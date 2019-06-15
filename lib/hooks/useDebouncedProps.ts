import { useEffect, useState } from 'react';

// useDebouncedProps is a hook that accepts a list of props, returning values
// debounced to the given time period and ignoring changes in between that interval.
//
// TODO: write tests
export default function useDebouncedProps<T = any>(thresholdMs: number, ...props: T[]): T[] {
  const [ debouncedValues, setDebouncedValues ] = useState(props);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValues(props), thresholdMs);
    return () => clearTimeout(timerId);
  }, props);

  return debouncedValues;
}
