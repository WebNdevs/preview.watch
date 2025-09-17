import React from 'react';
import { toast as hotToast, Toaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom toast component with icons
const CustomToast = ({ 
  type, 
  message, 
  onDismiss 
}: { 
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onDismiss: () => void;
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-md',
      bgColors[type]
    )}>
      {icons[type]}
      <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast utility functions
const toast = {
  success: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          type="success"
          message={message}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: 'top-right',
        ...options
      }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          type="error"
          message={message}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: 6000,
        position: 'top-right',
        ...options
      }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          type="warning"
          message={message}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: 5000,
        position: 'top-right',
        ...options
      }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          type="info"
          message={message}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: 'top-right',
        ...options
      }
    );
  },

  promise: hotToast.promise,
  loading: hotToast.loading,
  dismiss: hotToast.dismiss,
  remove: hotToast.remove
};

// Toast provider component
const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0
        }
      }}
    />
  );
};

export { toast, ToastProvider, CustomToast };