'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function PasswordStep({ formData, updateFormData, errors }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="Create a strong password"
            error={errors.password}
            icon={<Lock className="h-5 w-5" />}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            icon={<Lock className="h-5 w-5" />}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className={`flex items-center ${formData.password?.length >= 8 ? 'text-green-600' : ''}`}>
            <span className={`mr-2 text-xs ${formData.password?.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>●</span>
            At least 8 characters
          </li>
          <li className={`flex items-center ${/[A-Z]/.test(formData.password || '') ? 'text-green-600' : ''}`}>
            <span className={`mr-2 text-xs ${/[A-Z]/.test(formData.password || '') ? 'text-green-600' : 'text-gray-400'}`}>●</span>
            At least one uppercase letter
          </li>
          <li className={`flex items-center ${/[0-9]/.test(formData.password || '') ? 'text-green-600' : ''}`}>
            <span className={`mr-2 text-xs ${/[0-9]/.test(formData.password || '') ? 'text-green-600' : 'text-gray-400'}`}>●</span>
            At least one number
          </li>
          <li className={`flex items-center ${formData.password === formData.confirmPassword && formData.password ? 'text-green-600' : ''}`}>
            <span className={`mr-2 text-xs ${formData.password === formData.confirmPassword && formData.password ? 'text-green-600' : 'text-gray-400'}`}>●</span>
            Passwords match
          </li>
        </ul>
      </div>
    </div>
  );
}