'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaign } from '@/hooks/useCampaigns';
import { useCreateVideo } from '@/hooks/useVideos';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import Link from 'next/link';
import VideoUploader from '@/components/VideoUploader';

interface VideoForm {
  title: string;
  description: string;
  cta_text: string;
  cta_url: string;
  video_file: File | null;
  video_url: string;
  thumbnail_file: File | null;
}

export default function CreateVideoPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const { data: campaign } = useCampaign(parseInt(campaignId));
  const createVideo = useCreateVideo();
  
  const [form, setForm] = useState<VideoForm>({
    title: '',
    description: '',
    cta_text: '',
    cta_url: '',
    video_file: null,
    video_url: '',
    thumbnail_file: null
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Video title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.video_file) newErrors.video_file = 'Video file is required';
    if (form.cta_url && !isValidUrl(form.cta_url)) {
      newErrors.cta_url = 'Please enter a valid URL';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const videoData = {
        campaign_id: parseInt(campaignId),
        title: form.title,
        description: form.description,
        video_file: form.video_file!,
        thumbnail: form.thumbnail_file || undefined,
        variant: 'A' as const,
        is_active: true,
        cta_text: form.cta_text || '',
        cta_url: form.cta_url || ''
      };

      const video = await createVideo.mutateAsync(videoData);
      router.push(`/campaigns/${campaignId}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create video. Please try again.' });
      }
    }
  };

  const handleInputChange = (field: keyof VideoForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (type: 'video' | 'thumbnail', file: File) => {
    const field = type === 'video' ? 'video_file' : 'thumbnail_file';
    setForm(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'video' | 'thumbnail') => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      if (type === 'video' && file.type.startsWith('video/')) {
        handleFileSelect('video', file);
      } else if (type === 'thumbnail' && file.type.startsWith('image/')) {
        handleFileSelect('thumbnail', file);
      }
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/campaigns/${campaignId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Video</h1>
            <p className="text-gray-600">
              Add a new video to {campaign?.name || 'campaign'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Information */}
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

          {/* Video File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Video File</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUploader
                onUploadComplete={(fileUrl, file) => {
                  setForm(prev => ({
                    ...prev,
                    video_file: file,
                    video_url: fileUrl
                  }));
                  if (errors.video_file) {
                    setErrors(prev => ({ ...prev, video_file: '' }));
                  }
                }}
                onUploadProgress={(progress) => {
                  setUploadProgress(progress);
                }}
                onError={(errorMsg) => {
                  setErrors(prev => ({ ...prev, video_file: errorMsg }));
                }}
                maxSizeMB={100}
                acceptedFileTypes={['video/mp4', 'video/webm', 'video/avi']}
              />
              
              {form.video_file && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{form.video_file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(form.video_file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setForm(prev => ({ ...prev, video_file: null, video_url: '' }));
                        setUploadProgress(0);
                      }}
                    >
                      <X className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              )}
              
              {errors.video_file && (
                <p className="mt-1 text-sm text-red-600">{errors.video_file}</p>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300"
                onDrop={(e) => handleDrop(e, 'thumbnail')}
                onDragOver={(e) => { e.preventDefault(); }}
              >
                {form.thumbnail_file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">{form.thumbnail_file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileSelect('thumbnail', null as any)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(form.thumbnail_file.size)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">Drop thumbnail image here, or</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="mt-2"
                      >
                        Browse Files
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect('thumbnail', file);
                }}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Call-to-Action */}
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="CTA Text"
                value={form.cta_text}
                onChange={(e) => handleInputChange('cta_text', e.target.value)}
                placeholder="e.g., Learn More, Buy Now, Sign Up"
              />
              
              <Input
                label="CTA URL"
                value={form.cta_url}
                onChange={(e) => handleInputChange('cta_url', e.target.value)}
                error={errors.cta_url}
                placeholder="https://example.com"
                type="url"
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link href={`/campaigns/${campaignId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={createVideo.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createVideo.isPending ? 'Creating...' : 'Create Video'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}