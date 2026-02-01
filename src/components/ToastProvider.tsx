import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ToastMessage {
  toastId: string;
  message: string;
}

interface ToastContextValue {
  toastMessages: ToastMessage[];
  showToastMessage: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  const showToastMessage = useCallback((message: string) => {
    const toastId = `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const newToastMessage = { toastId, message };
    setToastMessages((previousMessages) => [...previousMessages, newToastMessage]);

    window.setTimeout(() => {
      setToastMessages((previousMessages) =>
        previousMessages.filter((toastMessage) => toastMessage.toastId !== toastId)
      );
    }, 2500);
  }, []);

  const contextValue = useMemo(
    () => ({ toastMessages, showToastMessage }),
    [toastMessages, showToastMessage]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toastMessages.map((toastMessage) => (
          <div key={toastMessage.toastId} className="toast-message">
            {toastMessage.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const contextValue = useContext(ToastContext);
  if (!contextValue) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return contextValue;
}
