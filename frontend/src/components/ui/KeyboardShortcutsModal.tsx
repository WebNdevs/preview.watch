'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { X, Keyboard } from 'lucide-react';
import { KeyboardShortcut, formatShortcut } from '@/hooks/useKeyboardShortcuts';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      description: 'Open command palette / search',
      action: () => {}
    },
    {
      key: '/',
      description: 'Focus search',
      action: () => {}
    },
    {
      key: 'h',
      description: 'Go to home/dashboard',
      action: () => {}
    },
    {
      key: 'c',
      description: 'Go to campaigns',
      action: () => {}
    },
    {
      key: 'v',
      description: 'Go to videos',
      action: () => {}
    },
    {
      key: 'n',
      ctrlKey: true,
      description: 'Create new campaign',
      action: () => {}
    },
    {
      key: 'u',
      ctrlKey: true,
      description: 'Upload new video',
      action: () => {}
    },
    {
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts help',
      action: () => {}
    },
    {
      key: 'Escape',
      description: 'Close modals/overlays',
      action: () => {}
    }
  ];

  const pageShortcuts: KeyboardShortcut[] = [
    {
      key: 'a',
      ctrlKey: true,
      description: 'Select all items',
      action: () => {}
    },
    {
      key: 'd',
      ctrlKey: true,
      description: 'Deselect all items',
      action: () => {}
    },
    {
      key: 'Delete',
      description: 'Delete selected items',
      action: () => {}
    },
    {
      key: 'f',
      ctrlKey: true,
      description: 'Open advanced filters',
      action: () => {}
    }
  ];

  const ShortcutItem = ({ shortcut }: { shortcut: KeyboardShortcut }) => (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {shortcut.description}
      </span>
      <div className="flex items-center gap-1">
        {formatShortcut(shortcut).split(' + ').map((key, index, array) => (
          <span key={index} className="flex items-center">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              {key}
            </kbd>
            {index < array.length - 1 && (
              <span className="mx-1 text-gray-400">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Global Shortcuts */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
              Global Shortcuts
            </h3>
            <div className="space-y-1">
              {globalShortcuts.map((shortcut, index) => (
                <ShortcutItem key={index} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* Page-specific Shortcuts */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
              Page-specific Shortcuts
            </h3>
            <div className="space-y-1">
              {pageShortcuts.map((shortcut, index) => (
                <ShortcutItem key={index} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Shortcuts don&apos;t work when typing in input fields</li>
              <li>• Press <kbd className="px-1 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 rounded">?</kbd> anytime to see this help</li>
              <li>• Press <kbd className="px-1 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 rounded">Esc</kbd> to close modals and overlays</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={onClose}>
              Got it
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook to manage the shortcuts modal
export function useKeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowModal = () => setIsOpen(true);
    const handleCloseModals = () => setIsOpen(false);

    window.addEventListener('show-shortcuts-modal', handleShowModal);
    window.addEventListener('close-modals', handleCloseModals);

    return () => {
      window.removeEventListener('show-shortcuts-modal', handleShowModal);
      window.removeEventListener('close-modals', handleCloseModals);
    };
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  };
}