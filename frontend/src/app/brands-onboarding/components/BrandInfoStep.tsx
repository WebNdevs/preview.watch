'use client';

import { Input } from '@/components/ui/Input';
import { Briefcase, Globe } from 'lucide-react';

interface BrandInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function BrandInfoStep({ formData, updateFormData, errors }: BrandInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Brand Name */}
      <div>
        <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
          Brand Name *
        </label>
        <Input
          id="brandName"
          name="brandName"
          type="text"
          value={formData.brandName || ''}
          onChange={handleChange}
          placeholder="Enter your brand name"
          error={errors.brandName}
          icon={<Briefcase className="h-5 w-5" />}
        />
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website || ''}
          onChange={handleChange}
          placeholder="https://yourbrand.com"
          icon={<Globe className="h-5 w-5" />}
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          value={formData.industry || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select your industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="retail">Retail</option>
          <option value="education">Education</option>
          <option value="entertainment">Entertainment</option>
          <option value="food-beverage">Food & Beverage</option>
          <option value="fashion">Fashion</option>
          <option value="automotive">Automotive</option>
          <option value="real-estate">Real Estate</option>
          <option value="travel">Travel & Tourism</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Company Size */}
      <div>
        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
          Company Size
        </label>
        <select
          id="companySize"
          name="companySize"
          value={formData.companySize || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501-1000">501-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Brand Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Tell us about your brand, products, and target audience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    </div>
  );
}