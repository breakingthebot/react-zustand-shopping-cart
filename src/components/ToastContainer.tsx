// src/components/ToastContainer.tsx
// Renders the list of active toast notifications with glassmorphic cards.
// Connects to: src/services/toastStore.ts
// Created: 2026-07-07

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type Toast } from '../services/toastStore';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={18} />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={18} />;
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className="toast-wrapper">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.type}`}>
          <div className="toast-card-content">
            {getIcon(toast.type)}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="toast-close"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-wrapper {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          pointer-events: none;
          max-width: 380px;
          width: calc(100% - 3rem);
        }

        .toast-card {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-glass);
          box-shadow: var(--popover-shadow);
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transition: all var(--transition-fast);
        }

        .toast-card-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-icon.success {
          color: var(--success-color);
        }

        .toast-icon.error {
          color: var(--error-color);
        }

        .toast-icon.info {
          color: var(--accent-color);
        }

        .toast-message {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          margin-left: 1rem;
          transition: all var(--transition-fast);
        }

        .toast-close:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        /* Border highlights based on notification type */
        .toast-card.success {
          border-left: 4px solid var(--success-color);
        }

        .toast-card.error {
          border-left: 4px solid var(--error-color);
        }

        .toast-card.info {
          border-left: 4px solid var(--accent-color);
        }

        @keyframes slideIn {
          from {
            transform: translateX(1.5rem);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
