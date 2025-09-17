'use client';

import { Input } from '@/components/ui/Input';
import { User, Mail, Phone } from 'lucide-react';

interface ContactInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function ContactInfoStep({ formData, updateFormData }: ContactInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          id="contactName"
          name="contactName"
          type="text"
          placeholder="Contact Name"
          value={formData.contactName || ''}
          onChange={handleChange}
          icon={<User className="h-5 w-5 text-gray-400" />}
          required
        />
      </div>

      <div>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email || ''}
          onChange={handleChange}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          required
        />
      </div>

      <div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone || ''}
          onChange={handleChange}
          icon={<Phone className="h-5 w-5 text-gray-400" />}
        />
      </div>
    </div>
  );
}