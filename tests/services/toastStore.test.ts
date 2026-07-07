// tests/services/toastStore.test.ts
// Unit tests for the Zustand toastStore.
// Connects to: src/services/toastStore.ts
// Created: 2026-07-07

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore } from '../../src/services/toastStore';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with an empty toasts list', () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('should add a toast with correct message and type', () => {
    const store = useToastStore.getState();
    store.addToast('Item added successfully', 'success');

    const activeToasts = useToastStore.getState().toasts;
    expect(activeToasts.length).toBe(1);
    expect(activeToasts[0].message).toBe('Item added successfully');
    expect(activeToasts[0].type).toBe('success');
    expect(activeToasts[0].id).toBeDefined();
  });

  it('should remove a toast manually by its ID', () => {
    const store = useToastStore.getState();
    store.addToast('Test Message', 'info');
    
    const addedToast = useToastStore.getState().toasts[0];
    expect(addedToast).toBeDefined();

    store.removeToast(addedToast.id);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it('should auto-dismiss toasts after duration', () => {
    // Enable fake timers
    vi.useFakeTimers();

    const store = useToastStore.getState();
    store.addToast('Auto dismiss test', 'success', 3000);

    expect(useToastStore.getState().toasts.length).toBe(1);

    // Fast-forward timers
    vi.advanceTimersByTime(3000);

    expect(useToastStore.getState().toasts.length).toBe(0);
  });
});
