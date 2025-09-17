'use client';

import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function ContactInfoStep({ formData, updateFormData, errors }: ContactInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Contact Name */}
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
          Contact Name *
        </label>
        <Input
          id="contactName"
          name="contactName"
          type="text"
          value={formData.contactName || ''}
          onChange={handleChange}
          placeholder="Your full name"
          error={errors.contactName}
          icon={<User className="h-5 w-5" />}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          icon={<Mail className="h-5 w-5" />}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          icon={<Phone className="h-5 w-5" />}
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <Input
          id="location"
          name="location"
          type="text"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="City, Country"
          icon={<MapPin className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}