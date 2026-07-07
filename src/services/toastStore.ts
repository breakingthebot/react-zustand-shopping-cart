// src/services/toastStore.ts
// Zustand store for managing global toast notifications.
// Connects to: UI components requesting toast feedback.
// Created: 2026-07-07

import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error', duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  /**
   * Adds a new toast notification. Auto-dismisses after the specified duration.
   * @param message The text message to display.
   * @param type The style type ('success' | 'info' | 'error'). Defaults to 'info'.
   * @param duration Time in milliseconds before dismissal. Defaults to 3000ms.
   */
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto dismiss
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  /**
   * Removes a specific toast notification by its ID.
   * @param id The unique identifier of the toast.
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Clears all toast notifications immediately.
   */
  clearToasts: () => {
    set({ toasts: [] });
  }
}));
