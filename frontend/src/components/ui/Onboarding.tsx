'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { X, ChevronLeft, ChevronRight, Target, Video, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  className?: string;
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Preview Watch!',
    description: 'Let\'s take a quick tour to help you get started with managing your video campaigns effectively.',
    icon: Target,
    position: 'center'
  },
  {
    id: 'campaigns',
    title: 'Create Your First Campaign',
    description: 'Campaigns help you organize your videos by project, client, or theme. Start by creating your first campaign.',
    icon: Target,
    target: '[data-onboarding="create-campaign"]',
    position: 'bottom',
    action: {
      label: 'Go to Campaigns',
      onClick: () => window.location.href = '/campaigns'
    }
  },
  {
    id: 'videos',
    title: 'Upload and Manage Videos',
    description: 'Once you have campaigns, you can upload videos and organize them. Each video can have custom thumbnails and descriptions.',
    icon: Video,
    target: '[data-onboarding="videos-nav"]',
    position: 'bottom'
  },
  {
    id: 'analytics',
    title: 'Track Performance',
    description: 'Monitor your video performance with detailed analytics including views, engagement, and campaign metrics.',
    icon: BarChart3,
    target: '[data-onboarding="analytics-nav"]',
    position: 'bottom'
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Personalize your workspace with theme preferences, notification settings, and account management.',
    icon: Settings,
    target: '[data-onboarding="theme-toggle"]',
    position: 'left'
  }
];

export function Onboarding({ 
  steps = defaultSteps, 
  isOpen, 
  onClose, 
  onComplete, 
  className 
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!isOpen || !step?.target) {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(step.target);
    setHighlightedElement(element);

    // Scroll element into view
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isOpen, step?.target]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstStep) return;
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  const getTooltipPosition = () => {
    if (!highlightedElement || !step?.position || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 16;

    switch (step.position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - offset,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.left - tooltipWidth - offset,
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.right + offset,
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip} />
      
      {/* Highlight */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            border: '2px solid hsl(var(--primary))',
            borderRadius: '8px',
            boxShadow: '0 0 0 4px hsl(var(--primary) / 0.2)'
          }}
        />
      )}

      {/* Tooltip */}
      <Card 
        className={cn(
          'fixed z-50 w-80 shadow-lg',
          className
        )}
        style={getTooltipPosition()}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step.action && (
            <div className="mb-4">
              <Button
                onClick={step.action.onClick}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {step.action.label}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {steps.length}
              </span>
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-colors',
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                className="h-8 px-3"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook for managing onboarding state
export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboarding-completed');
    if (completed) {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const startOnboarding = () => {
    setIsOpen(true);
  };

  const completeOnboarding = () => {
    setIsOpen(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem('onboarding-completed');
  };

  return {
    isOpen,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
    closeOnboarding: () => setIsOpen(false)
  };
}

export default Onboarding;