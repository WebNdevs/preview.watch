'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Select } from './Select';
import { X, Filter, Save, Bookmark, Calendar, Tag, User, Eye } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean | null | string[]>;
  isDefault?: boolean;
}

export interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string | number | boolean | null | string[]>) => void;
  filterOptions: FilterOption[];
  currentFilters: Record<string, string | number | boolean | null | string[]>;
  presets?: FilterPreset[];
  onSavePreset?: (name: string, filters: Record<string, string | number | boolean | null | string[]>) => void;
  onDeletePreset?: (presetId: string) => void;
}

export function AdvancedFilters({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  currentFilters,
  presets = [],
  onSavePreset,
  onDeletePreset
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | null | string[]>>(currentFilters);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  if (!isOpen) return null;

  const handleFilterChange = (filterId: string, value: string | number | boolean | null | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string | number | boolean | null | string[]>);
    setFilters(clearedFilters);
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    setFilters(preset.filters);
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim(), filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.id] || '';

    switch (option.type) {
      case 'select':
        return (
          <Select
            value={typeof value === 'string' ? value : String(value || '')}
            onChange={(selectedValue) => handleFilterChange(option.id, selectedValue)}
            options={[
              { value: '', label: option.placeholder || 'Select...' },
              ...(option.options?.map(opt => ({ value: opt.value, label: opt.label })) || [])
            ]}
            placeholder={option.placeholder || 'Select...'}
          />
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {option.options?.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, opt.value]
                      : selectedValues.filter(v => v !== opt.value);
                    handleFilterChange(option.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={typeof value === 'string' ? value : String(value || '')}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        );

      case 'daterange':
        const dateRange = (typeof value === 'object' && value !== null && !Array.isArray(value) && 'start' in value && 'end' in value) 
          ? value as { start: string; end: string }
          : { start: '', end: '' };
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-500 w-20">Start date:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleFilterChange(option.id, { ...dateRange, start: e.target.value } as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-500 w-20">End date:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleFilterChange(option.id, { ...dateRange, end: e.target.value } as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'string' || typeof value === 'number' ? value : String(value || '')}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            placeholder={option.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        );

      default: // text
        return (
          <input
            type="text"
            value={typeof value === 'string' ? value : String(value || '')}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            placeholder={option.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-none">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Advanced Filters</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Presets */}
          {presets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Presets
              </h3>
              <div className="flex flex-wrap gap-2">
                {presets.map(preset => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(preset)}
                    className="flex items-center gap-2"
                  >
                    {preset.name}
                    {preset.isDefault && <span className="text-xs text-blue-600">(Default)</span>}
                    {onDeletePreset && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePreset(preset.id);
                        }}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {filterOptions.map(option => (
              <div key={option.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.label}
                </label>
                <div className="mt-1">
                  {renderFilterInput(option)}
                </div>
              </div>
            ))}
          </div>

          {/* Save Preset */}
          {onSavePreset && (
            <div className="mb-6">
              {showSavePreset ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
                  />
                  <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setShowSavePreset(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowSavePreset(true)}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save as Preset
                </Button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
}

// Predefined filter configurations for common use cases
export const campaignFilterOptions: FilterOption[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'completed', label: 'Completed' },
      { value: 'draft', label: 'Draft' }
    ]
  },
  {
    id: 'category',
    label: 'Category',
    type: 'multiselect',
    options: [
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'education', label: 'Education' },
      { value: 'entertainment', label: 'Entertainment' }
    ]
  },
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'daterange'
  },
  {
    id: 'minViews',
    label: 'Minimum Views',
    type: 'number',
    placeholder: 'Enter minimum views'
  },
  {
    id: 'creator',
    label: 'Creator',
    type: 'text',
    placeholder: 'Search by creator name'
  }
];

export const videoFilterOptions: FilterOption[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'processing', label: 'Processing' },
      { value: 'archived', label: 'Archived' }
    ]
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select',
    options: [
      { value: 'short', label: 'Short (< 5 min)' },
      { value: 'medium', label: 'Medium (5-20 min)' },
      { value: 'long', label: 'Long (> 20 min)' }
    ]
  },
  {
    id: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { value: 'tutorial', label: 'Tutorial' },
      { value: 'review', label: 'Review' },
      { value: 'demo', label: 'Demo' },
      { value: 'interview', label: 'Interview' }
    ]
  },
  {
    id: 'uploadDate',
    label: 'Upload Date',
    type: 'daterange'
  },
  {
    id: 'minViews',
    label: 'Minimum Views',
    type: 'number',
    placeholder: 'Enter minimum views'
  }
];