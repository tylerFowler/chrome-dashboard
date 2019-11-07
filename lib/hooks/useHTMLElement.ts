import { useState, useCallback } from 'react';

// useHTMLElement is a hook that can be used to get a handle on a specific HTMLElement
// for retrieving information about it. The returned ref is a function that should
// be assigned to the desired element's 'ref', populating the returned element with
// the raw HTMLElement object for that ref. Updates when the reference changes.
export default function useHTMLElement(): [ Readonly<HTMLElement>, React.Ref<any> ] {
  const [ $element, setElement ] = useState(null);

  const ref = useCallback(($node: HTMLElement) => {
    if ($node) {
      setElement($node);
    }
  }, []);

  return [ $element, ref ];
}
