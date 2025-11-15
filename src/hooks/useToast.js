import { useState, useCallback } from 'react';

// Simple toast notification hook for alerts and notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now();
    const toast = {
      id,
      message: typeof message === 'object' ? message.message || message.title : message,
      type: typeof message === 'object' ? message.type || type : type,
      title: typeof message === 'object' ? message.title : undefined
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { notify, removeToast, toasts };
};
