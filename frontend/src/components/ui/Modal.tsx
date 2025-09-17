'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop with Glassmorphism */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal with Glassmorphism */}
      <div
        className={cn(
          'relative w-full transition-all duration-300 animate-in fade-in-0 zoom-in-95',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700/30">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 h-auto rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-200"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className={cn('p-6 text-gray-700 dark:text-gray-200', title && 'pt-4')}>
          {children}
        </div>
      </div>
    </div>
  </div>
  );
};

export { Modal };