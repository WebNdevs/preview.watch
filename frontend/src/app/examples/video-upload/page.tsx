'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import VideoUploadForm from '@/components/VideoUploadForm';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  videoFile: File | null;
}

export default function VideoUploadExample() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, you would submit the form data to your API
      // The video file is already uploaded at this point, so you just need to send the metadata
      console.log('Form submitted with data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Video uploaded successfully!');
      
      // In a real app, you might redirect to the video page
      // router.push('/videos');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Video Upload Example</h1>
            <p className="text-gray-600">
              This example demonstrates how to use the VideoUploader component with progress tracking
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-blue-800 mb-2">How it works</h2>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li>Select a video file to immediately start uploading</li>
            <li>Watch the progress bar as your video uploads</li>
            <li>The Submit button remains disabled until upload completes</li>
            <li>After upload, the video URL is stored and ready to submit with the form</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This demo uses a simulated upload process. In a production environment, 
              you would connect to your actual API endpoint.
            </p>
          </div>
        </div>

        {/* Video Upload Form */}
        <VideoUploadForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
}