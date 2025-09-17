'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;

      return keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches;
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
}

// Global shortcuts that work across the entire application
export function useGlobalShortcuts() {
  const router = useRouter();

  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      description: 'Open command palette / search',
      action: () => {
        // This would open a command palette if implemented
        console.log('Command palette shortcut triggered');
      }
    },
    {
      key: '/',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('input[type="text"][placeholder*="search" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    },
    {
      key: 'h',
      description: 'Go to home/dashboard',
      action: () => router.push('/dashboard')
    },
    {
      key: 'c',
      description: 'Go to campaigns',
      action: () => router.push('/campaigns')
    },
    {
      key: 'v',
      description: 'Go to videos',
      action: () => router.push('/videos')
    },
    {
      key: 'n',
      ctrlKey: true,
      description: 'Create new campaign',
      action: () => router.push('/campaigns/create')
    },
    {
      key: 'u',
      ctrlKey: true,
      description: 'Upload new video',
      action: () => router.push('/videos/upload')
    },
    {
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts help',
      action: () => {
        // This would show the shortcuts modal
        const event = new CustomEvent('show-shortcuts-modal');
        window.dispatchEvent(event);
      }
    },
    {
      key: 'Escape',
      description: 'Close modals/overlays',
      action: () => {
        // This would close any open modals
        const event = new CustomEvent('close-modals');
        window.dispatchEvent(event);
      }
    }
  ];

  useKeyboardShortcuts(globalShortcuts);
}

// Page-specific shortcuts for campaigns
export function useCampaignShortcuts(callbacks: {
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDelete?: () => void;
  onFilter?: () => void;
}) {
  const campaignShortcuts: KeyboardShortcut[] = [
    {
      key: 'a',
      ctrlKey: true,
      description: 'Select all campaigns',
      action: () => callbacks.onSelectAll?.()
    },
    {
      key: 'd',
      ctrlKey: true,
      description: 'Deselect all campaigns',
      action: () => callbacks.onClearSelection?.()
    },
    {
      key: 'Delete',
      description: 'Delete selected campaigns',
      action: () => callbacks.onDelete?.()
    },
    {
      key: 'f',
      ctrlKey: true,
      description: 'Open filters',
      action: () => callbacks.onFilter?.()
    }
  ];

  useKeyboardShortcuts(campaignShortcuts);
}

// Page-specific shortcuts for videos
export function useVideoShortcuts(callbacks: {
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDelete?: () => void;
  onFilter?: () => void;
}) {
  const videoShortcuts: KeyboardShortcut[] = [
    {
      key: 'a',
      ctrlKey: true,
      description: 'Select all videos',
      action: () => callbacks.onSelectAll?.()
    },
    {
      key: 'd',
      ctrlKey: true,
      description: 'Deselect all videos',
      action: () => callbacks.onClearSelection?.()
    },
    {
      key: 'Delete',
      description: 'Delete selected videos',
      action: () => callbacks.onDelete?.()
    },
    {
      key: 'f',
      ctrlKey: true,
      description: 'Open filters',
      action: () => callbacks.onFilter?.()
    }
  ];

  useKeyboardShortcuts(videoShortcuts);
}

// Utility function to format shortcut display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push('Cmd');
  
  // Handle special keys
  let key = shortcut.key;
  if (key === ' ') key = 'Space';
  if (key === 'ArrowUp') key = '↑';
  if (key === 'ArrowDown') key = '↓';
  if (key === 'ArrowLeft') key = '←';
  if (key === 'ArrowRight') key = '→';
  
  parts.push(key);
  
  return parts.join(' + ');
}