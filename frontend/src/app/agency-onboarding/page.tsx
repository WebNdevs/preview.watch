'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Building2, Mail, Lock, User, Phone } from 'lucide-react';
import { MultiStepForm } from '@/components/ui/MultiStepForm';

export default function AgencyOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Import all step components
  const { AgencyInfoStep, ContactInfoStep, PasswordStep, ReviewStep } = require('./components');

  const initialFormData = {
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    website: '',
    description: ''
  };

  const validateForm = (formData: any) => {
    const newErrors: Record<string, string> = {};

    if (!formData.agencyName?.trim()) {
      newErrors.agencyName = 'Agency name is required';
    }

    if (!formData.contactName?.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (formData: any) => {
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement API call to register agency
      console.log('Agency registration data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard or confirmation page
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  // Define the steps for the multi-step form with render functions
  const steps = [
    {
      title: 'Agency Info',
      description: 'Tell us about your agency',
      content: (formData: any, updateFormData: any) => (
        <AgencyInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
      )
    },
    {
      title: 'Contact Info',
      description: 'How can we reach you?',
      content: (formData: any, updateFormData: any) => (
        <ContactInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
      )
    },
    {
      title: 'Set Password',
      description: 'Secure your account',
      content: (formData: any, updateFormData: any) => (
        <PasswordStep formData={formData} updateFormData={updateFormData} errors={errors} />
      )
    },
    {
      title: 'Review',
      description: 'Confirm your information',
      content: (formData: any) => (
        <ReviewStep formData={formData} />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Agency Registration</h2>
              <p className="text-gray-600">Join our platform as a marketing agency</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Multi-step form */}
        <div className="p-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
          
          <MultiStepForm 
            steps={steps} 
            onComplete={handleSubmit} 
            initialData={initialFormData}
          />
          
          {/* Terms */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-600">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          
          {/* Login Link */}
          <div className="text-center pt-4 mt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}