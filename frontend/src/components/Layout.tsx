'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  LayoutDashboard, 
  Video, 
  Play,
  BarChart3, 
  Users, 
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Onboarding, useOnboarding } from '@/components/ui/Onboarding';
import { KeyboardShortcutsModal, useKeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOpen, hasCompletedOnboarding, startOnboarding, completeOnboarding, closeOnboarding } = useOnboarding();
  const shortcutsModal = useKeyboardShortcutsModal();
  
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(user?.role === 'brand' ? [
      { name: 'Campaigns', href: '/campaigns', icon: Video },
      { name: 'Videos', href: '/videos', icon: Play },
    ] : []),
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin' || user?.role === 'agency' ? [{ name: 'Users', href: '/users', icon: Users }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Backups', href: '/admin/backups', icon: Shield }] : []),
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-80 flex-col bg-card border-r shadow-xl transition-transform duration-300">
          <div className="flex h-20 items-center justify-between px-6">
            <Link href="/dashboard" className="flex items-center">
              <img src="/pw-logo.svg" alt="Preview Watch Logo" className="h-60 w-auto mr-2 mt-4" />
              <h1 className="text-xl font-bold text-card-foreground">Preview Watch</h1>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="h-10 w-10 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 min-h-[48px] hover:shadow-sm"
                  onClick={() => setSidebarOpen(false)}
                  data-onboarding={item.name === 'Videos' ? 'videos-nav' : item.name === 'Analytics' ? 'analytics-nav' : undefined}
                >
                  <Icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <div data-onboarding="theme-toggle">
                    <ThemeToggle />
                  </div>
                  
                  {/* Keyboard Shortcuts Help */}
                  <button
                    onClick={shortcutsModal.open}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    title="Keyboard shortcuts (Shift + ?)"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </button>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive min-h-[44px]"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center">
              <img src="/pw-logo.svg" alt="Preview Watch Logo" className="h-12 w-auto" />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                           href={item.href}
                           className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-muted-foreground hover:text-accent-foreground hover:bg-accent transition-colors"
                           data-onboarding={item.name === 'Videos' ? 'videos-nav' : item.name === 'Analytics' ? 'analytics-nav' : undefined}
                         >
                           <Icon className="h-5 w-5 shrink-0" />
                           {item.name}
                         </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 transition-all duration-200">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-md sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">{user?.name || user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 transition-all duration-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-200">
            {children}
          </div>
        </main>
      </div>
      
      {/* Onboarding */}
      <Onboarding 
        steps={[]}
        isOpen={isOpen}
        onComplete={completeOnboarding}
        onClose={closeOnboarding}
      />
      
      <KeyboardShortcutsModal
        isOpen={shortcutsModal.isOpen}
        onClose={shortcutsModal.close}
      />
    </div>
  );
};

export default Layout;