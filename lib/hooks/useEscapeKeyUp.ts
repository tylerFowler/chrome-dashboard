import { useEffect } from 'react';

export default function useEscapeKeyUp(onKeyUp: () => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onKeyUp();
      }
    };

    document.addEventListener('keyup', listener);
    return () => document.removeEventListener('keyup', listener);
  });
}
