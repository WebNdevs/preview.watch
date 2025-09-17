'use client';

import { Input } from '@/components/ui/Input';
import { Building2, Globe } from 'lucide-react';

interface AgencyInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function AgencyInfoStep({ formData, updateFormData }: AgencyInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          id="agencyName"
          name="agencyName"
          type="text"
          placeholder="Agency Name"
          value={formData.agencyName || ''}
          onChange={handleChange}
          icon={<Building2 className="h-5 w-5 text-gray-400" />}
          required
        />
      </div>

      <div>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="Website URL"
          value={formData.website || ''}
          onChange={handleChange}
          icon={<Globe className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Agency Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about your agency..."
          value={formData.description || ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}