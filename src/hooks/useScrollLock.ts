import { useEffect } from 'react';

let activeLockCount = 0;
let originalBodyOverflow = '';

/**
 * Safely locks document.body scroll when a modal or drawer is open.
 * Uses a module-level reference counter so nested/overlapping modals
 * only restore scrolling once the last lock is released.
 */
export function useScrollLock(isLocked: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeLockCount += 1;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);
      if (activeLockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
      }
    };
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked || !onEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, onEscape]);
}
