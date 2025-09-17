import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'floating';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, variant = 'default', ...props }, ref) => {
    const inputId = props.id || props.name;
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };
    
    if (variant === 'floating') {
      return (
        <div className="relative">
          <div className="relative">
            <textarea
              className={cn(
                'peer w-full min-h-[120px] px-4 pt-8 pb-3 text-sm bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 placeholder-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y',
                error && 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/10 dark:focus:ring-red-400/10',
                className
              )}
              ref={ref}
              id={inputId}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={props.placeholder || ' '}
              {...props}
            />
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400',
                  (isFocused || hasValue || props.value) 
                    ? 'top-3 text-xs font-medium text-blue-600 dark:text-blue-400' 
                    : 'top-6 text-sm',
                  error && (isFocused || hasValue || props.value) && 'text-red-500 dark:text-red-400'
                )}
              >
                {label}
              </label>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{helperText}</p>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:focus-visible:ring-blue-400/10 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-300 dark:hover:border-gray-600 resize-y',
            error && 'border-red-500 dark:border-red-400 focus-visible:border-red-500 dark:focus-visible:border-red-400 focus-visible:ring-red-500/10 dark:focus-visible:ring-red-400/10',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };