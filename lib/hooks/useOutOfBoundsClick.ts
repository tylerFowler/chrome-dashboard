import React, { useEffect } from 'react';

export type UseOutOfBoundsClickHook = (
  oobTargetRef: React.RefObject<HTMLElement>,
  onClick: () => void,
  isActive?: boolean,
) => void;

export default (function useOutOfBoundsClick(oobTargetRef, onClick, isActive = true) {
  return useEffect(() => {
    if (isActive === false) {
      return;
    }

    const listener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (oobTargetRef && !oobTargetRef.current.contains(target)) {
        onClick();
      }
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  });
}) as UseOutOfBoundsClickHook;
