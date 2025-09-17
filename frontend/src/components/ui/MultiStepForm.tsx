'use client';

import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description?: string;
  content: ReactNode | ((formData: any, updateFormData: (data: any) => void) => ReactNode);
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: any) => void;
  initialData?: any;
  className?: string;
}

export function MultiStepForm({
  steps,
  onComplete,
  initialData = {},
  className,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formContainerRef = React.useRef<HTMLDivElement>(null);

  // Find the closest scrollable parent element
  const scrollToTop = () => {
    if (formContainerRef.current) {
      // Try to find the closest parent with overflow-y-auto
      let element: HTMLElement = formContainerRef.current;
      let scrollableParent: HTMLElement | null = null;
      
      while (element.parentElement) {
        const parentElement = element.parentElement;
        const style = window.getComputedStyle(parentElement);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          scrollableParent = parentElement;
          break;
        }
        element = parentElement;
      }
      
      // If found a scrollable parent, scroll it to top
      if (scrollableParent) {
        scrollableParent.scrollTop = 0;
      } else {
        // Fallback to window scroll if no scrollable parent found
        window.scrollTo(0, 0);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)} ref={formContainerRef}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                  index < currentStep
                    ? 'bg-blue-600 text-white'
                    : index === currentStep
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative w-full h-2 bg-gray-100 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-1">{steps[currentStep].title}</h2>
        {steps[currentStep].description && (
          <p className="text-gray-500 mb-4">{steps[currentStep].description}</p>
        )}
        <div className="mt-4">
          {typeof steps[currentStep].content === 'function'
            ? (steps[currentStep].content as Function)(formData, updateFormData)
            : React.cloneElement(steps[currentStep].content as React.ReactElement, {
                formData,
                updateFormData,
              } as any)}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>Continue</Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            loading={isSubmitting}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}