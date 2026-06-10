'use client';

import { createContext, useCallback, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const ref = useRef(null);

  const show = useCallback(({ severity, summary, detail, life = 3000 }) => {
    ref.current?.show({ severity, summary, detail, life });
  }, []);

  const success = useCallback(
    (summary, detail) => show({ severity: 'success', summary, detail, life: 3000 }),
    [show]
  );

  const error = useCallback(
    (summary, detail) => show({ severity: 'error', summary, detail, life: 5000 }),
    [show]
  );

  const info = useCallback(
    (summary, detail) => show({ severity: 'info', summary, detail }),
    [show]
  );

  const warn = useCallback(
    (summary, detail) => show({ severity: 'warn', summary, detail }),
    [show]
  );

  return (
    <ToastContext.Provider value={{ show, success, error, info, warn }}>
      <Toast ref={ref} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
