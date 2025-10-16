import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++idSeq;
    const variant = toast.variant || 'info';
    const duration = toast.duration ?? (variant === 'error' ? 6000 : 4000);
    const item = { id, ...toast, variant };
    setToasts((prev) => [...prev, item]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = useMemo(() => ({
    toast: (opts) => push(opts),
    success: (message, opts = {}) => push({ title: message, variant: 'success', ...opts }),
    error: (message, opts = {}) => push({ title: message, variant: 'error', ...opts }),
    info: (message, opts = {}) => push({ title: message, variant: 'info', ...opts }),
    remove,
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-[90vw] max-w-sm">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />)
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function Toast({ toast, onClose }) {
  const { title, description, variant = 'info' } = toast;
  const isError = variant === 'error';
  const isSuccess = variant === 'success';
  const role = isError ? 'alert' : 'status';
  const ariaLive = isError ? 'assertive' : 'polite';

  const colorBar = isError
    ? 'bg-red-600'
    : isSuccess
      ? 'bg-green-600'
      : 'bg-primary-600';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={[
        'pointer-events-auto relative flex w-full overflow-hidden rounded-md bg-white shadow-[var(--shadow-2)] border',
        'focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2',
      ].join(' ')}
    >
      <div className={[colorBar, 'w-1'].join(' ')} aria-hidden="true" />
      <div className="flex-1 p-3">
        {title && <div className="text-sm font-medium text-ink-900">{title}</div>}
        {description && <div className="text-sm text-ink-700 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onClose}
        className="btn btn-ghost px-3 py-2"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export default ToastProvider;

