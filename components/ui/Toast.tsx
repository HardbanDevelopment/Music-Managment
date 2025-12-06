import React, { useContext, useEffect } from 'react';
import { ToastContext } from '../../context/AuthContext';

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseClasses = 'flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-dark-card divide-x divide-gray-200 rounded-lg shadow-2xl space-x';
  const typeClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
  };

  const Icon = () => {
    if (type === 'success') {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
    );
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <Icon />
      <div className="pl-4 text-sm font-normal text-gray-200">{message}</div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null; // or handle the case where context is undefined
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
