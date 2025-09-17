import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'floating';
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, placeholder = 'Select...', label, error, helperText, disabled, className, variant = 'default' }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    
    const selectedOption = options.find(option => option.value === value);
    const hasValue = !!value;
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setIsFocused(!isOpen);
      }
    };
    
    const handleSelect = (option: SelectOption) => {
      if (!option.disabled) {
        onChange?.(option.value);
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(!isOpen);
          setIsFocused(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          setIsFocused(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setIsFocused(true);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setIsFocused(true);
          }
          break;
      }
    };
    
    if (variant === 'floating') {
      return (
        <div className="relative" ref={ref}>
          <div className="relative" ref={selectRef}>
            <div
              className={cn(
                'peer w-full h-14 px-4 pt-6 pb-2 text-sm bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between',
                error && 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/10 dark:focus:ring-red-400/10',
                isOpen && 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/10 dark:ring-blue-400/10',
                className
              )}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              tabIndex={disabled ? -1 : 0}
              role="combobox"
              aria-expanded={isOpen}
              aria-controls="select-dropdown-options"
              aria-haspopup="listbox"
            >
              <span className={cn(
                'block truncate pt-2',
                !selectedOption && 'text-transparent'
              )}>
                {selectedOption?.label || placeholder}
              </span>
              <ChevronDown className={cn(
                'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                isOpen && 'rotate-180'
              )} />
            </div>
            
            {label && (
              <label className={cn(
                'absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400',
                (isFocused || hasValue || isOpen) 
                  ? 'top-2 text-xs font-medium text-blue-600 dark:text-blue-400' 
                  : 'top-1/2 -translate-y-1/2 text-sm',
                error && (isFocused || hasValue || isOpen) && 'text-red-500 dark:text-red-400'
              )}>
                {label}
              </label>
            )}
            
            {/* Options dropdown */}
            {isOpen && (
              <div
                ref={optionsRef}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      'px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between',
                      'hover:bg-gray-50 dark:hover:bg-gray-800',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      option.value === value && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    )}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                ))}
              </div>
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
      <div className="space-y-2" ref={ref}>
        {label && (
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative" ref={selectRef}>
          <div
            className={cn(
              'flex h-12 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:focus-visible:ring-blue-400/10 hover:border-gray-300 dark:hover:border-gray-600 items-center justify-between',
              error && 'border-red-500 dark:border-red-400 focus-visible:border-red-500 dark:focus-visible:border-red-400 focus-visible:ring-red-500/10 dark:focus-visible:ring-red-400/10',
              isOpen && 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/10 dark:ring-blue-400/10',
              className
            )}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="select-dropdown-options"
            aria-haspopup="listbox"
          >
            <span className={cn(
              'block truncate',
              !selectedOption && 'text-gray-400 dark:text-gray-500'
            )}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </div>
          
          {/* Options dropdown */}
          {isOpen && (
            <div
              ref={optionsRef}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between',
                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    option.value === value && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  )}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
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

Select.displayName = 'Select';

export { Select, type SelectOption };