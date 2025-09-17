'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save } from 'lucide-react';
import VideoUploader from './VideoUploader';

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  videoFile: File | null;
}

interface VideoUploadFormProps {
  onSubmit: (data: VideoFormData) => void;
  isSubmitting?: boolean;
}

const VideoUploadForm = ({ onSubmit, isSubmitting = false }: VideoUploadFormProps) => {
  const [form, setForm] = useState<VideoFormData>({
    title: '',
    description: '',
    videoUrl: '',
    videoFile: null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleInputChange = (field: keyof VideoFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUploadComplete = (fileUrl: string, file: File) => {
    // Store both the URL and the file, and ensure the file has the objectURL property set
    if (!file.objectURL) {
      file.objectURL = fileUrl;
    }
    
    setForm(prev => ({
      ...prev,
      videoUrl: fileUrl,
      videoFile: file
    }));
    setIsUploading(false);
    setUploadProgress(100);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setIsUploading(progress < 100);
  };

  const handleUploadError = (error: string) => {
    setErrors(prev => ({ ...prev, video: error }));
    setIsUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Video title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.videoUrl) newErrors.video = 'Please upload a video file';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
  };

  const isFormValid = !!form.title && !!form.description && !!form.videoUrl && !isUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Video Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Video Title"
            value={form.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            placeholder="Enter video title"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Describe your video"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video File</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoUploader
            onUploadComplete={handleUploadComplete}
            onUploadProgress={handleUploadProgress}
            onError={handleUploadError}
            maxSize={100 * 1024 * 1024} // 100MB
          />
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">
                Upload Progress: {uploadProgress}%
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isFormValid || isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default VideoUploadForm;