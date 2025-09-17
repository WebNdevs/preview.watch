'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function PasswordStep({ formData, updateFormData }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error when typing
    if (passwordError) {
      setPasswordError('');
    }
    
    // Check if passwords match when changing confirm password
    if (name === 'confirmPassword' && formData.password && value !== formData.password) {
      setPasswordError('Passwords do not match');
    } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={formData.password || ''}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={toggleShowConfirmPassword}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {passwordError && (
        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
      )}

      <div className="mt-2">
        <p className="text-sm text-gray-500">Password must:</p>
        <ul className="text-xs text-gray-500 list-disc pl-5 mt-1 space-y-1">
          <li>Be at least 8 characters long</li>
          <li>Include at least one uppercase letter</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>
    </div>
  );
}