'use client';

interface ReviewStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 mb-4">
        Please review your information before submitting. You can go back to previous steps to make changes if needed.
      </p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Agency Information</h3>
          <div className="mt-2 bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{formData.agencyName || 'Not provided'}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.website || 'No website provided'}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.description || 'No description provided'}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
          <div className="mt-2 bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{formData.contactName || 'Not provided'}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.email || 'No email provided'}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.phone || 'No phone provided'}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Account Security</h3>
          <div className="mt-2 bg-gray-50 p-3 rounded-md">
            <p className="font-medium">Password: ••••••••</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          By clicking "Complete" you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}