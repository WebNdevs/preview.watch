'use client';

import Link from 'next/link';

interface ReviewStepProps {
  formData: any;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Review Your Information</h3>
      <p className="text-sm text-gray-600">Please review your information before creating your account.</p>

      {/* Brand Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Brand Information</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Brand Name:</span>
            <span className="text-sm font-medium text-gray-900">{formData.brandName || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Website:</span>
            <span className="text-sm font-medium text-gray-900">{formData.website || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Industry:</span>
            <span className="text-sm font-medium text-gray-900">{formData.industry || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Company Size:</span>
            <span className="text-sm font-medium text-gray-900">{formData.companySize || 'Not provided'}</span>
          </div>
          {formData.description && (
            <div className="pt-2">
              <span className="text-sm text-gray-500 block mb-1">Description:</span>
              <p className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                {formData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Contact Name:</span>
            <span className="text-sm font-medium text-gray-900">{formData.contactName || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Email:</span>
            <span className="text-sm font-medium text-gray-900">{formData.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Phone:</span>
            <span className="text-sm font-medium text-gray-900">{formData.phone || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Location:</span>
            <span className="text-sm font-medium text-gray-900">{formData.location || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Account Security</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Password:</span>
            <span className="text-sm font-medium text-gray-900">••••••••</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <p className="text-sm text-purple-800">
          By clicking "Create Brand Account", you agree to our{' '}
          <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}