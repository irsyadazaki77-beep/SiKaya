import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from '../useScrollLock';

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('locks body scroll when active and restores on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('maintains scroll lock with reference counting for overlapping modals', () => {
    const modal1 = renderHook(() => useScrollLock(true));
    const modal2 = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    modal1.unmount();
    // modal2 is still open, so body must remain locked
    expect(document.body.style.overflow).toBe('hidden');

    modal2.unmount();
    // all modals closed, scroll restored
    expect(document.body.style.overflow).toBe('');
  });

  it('invokes onEscape callback when Escape key is pressed while locked', () => {
    const onEscape = vi.fn();
    renderHook(() => useScrollLock(true, onEscape));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});
