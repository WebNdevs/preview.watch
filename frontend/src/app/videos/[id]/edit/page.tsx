'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVideo, useUpdateVideo } from '@/hooks/useVideos';
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
  thumbnail_file: File | null;
  is_active: boolean;
}

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = parseInt(params.id as string);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const { data: video, isLoading } = useVideo(videoId);
  const updateVideo = useUpdateVideo();
  
  const [form, setForm] = useState<VideoForm>({
    title: '',
    description: '',
    cta_text: '',
    cta_url: '',
    video_file: null,
    thumbnail_file: null,
    is_active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Populate form when video data is loaded
  // Populate form when video data is loaded
  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || '',
        description: video.description || '',
        cta_text: video.cta_text || '',
        cta_url: video.cta_url || '',
        video_file: null,
        thumbnail_file: null,
        is_active: video.status === 'active'
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Video title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.cta_url && !isValidUrl(form.cta_url)) {
      newErrors.cta_url = 'Please enter a valid URL';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Send all available fields to the backend
      const videoData: any = {
        title: form.title,
        description: form.description,
        cta_text: form.cta_text || '',  // Always send cta_text even if empty
        cta_url: form.cta_url || '',    // Always send cta_url even if empty
        is_active: form.is_active,
        // Always include campaign_id from the video data
        campaign_id: video?.campaign_id,
        // Always include variant from the video data
        variant: video?.variant,
        // Always include duration from the video data
        duration: video?.duration
      };

      // Include media files if they were changed
      if (form.thumbnail_file) {
        videoData.thumbnail = form.thumbnail_file;
      }
      
      // Include video_file if it was uploaded
      if (form.video_file) {
        videoData.video_file = form.video_file;
      }

      console.log('Submitting video data:', videoData);
      await updateVideo.mutateAsync({ id: videoId, data: videoData });
      router.push(`/videos/${videoId}`);
    } catch (error: any) {
      console.error('Video update error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to update video. Please try again.' });
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Video Not Found</h2>
            <p className="text-gray-600 mb-4">The video you're trying to edit doesn't exist.</p>
            <Link href="/videos">
              <Button>Back to Videos</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/videos/${videoId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
              <p className="text-gray-600">Update your video content and settings</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title *
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter video title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your video"
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible to viewers)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Text
                </label>
                <Input
                  value={form.cta_text}
                  onChange={(e) => handleInputChange('cta_text', e.target.value)}
                  placeholder="e.g., Learn More, Buy Now, Sign Up"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA URL
                </label>
                <Input
                  value={form.cta_url}
                  onChange={(e) => handleInputChange('cta_url', e.target.value)}
                  placeholder="https://example.com"
                  className={errors.cta_url ? 'border-red-500' : ''}
                />
                {errors.cta_url && (
                  <p className="text-red-500 text-sm mt-1">{errors.cta_url}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media Files */}
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Video
                </label>
                {video.file_url && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <video
                      src={video.file_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Video File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Video File (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-2"><strong>Note:</strong> You don't need to upload a new video file to update other information.</p>
                <VideoUploader
                  onUploadComplete={(fileUrl, file) => {
                    // Store both the file and its URL
                    setForm(prev => ({
                      ...prev,
                      video_file: file,
                      video_url: fileUrl
                    }));
                    if (errors.video_file) {
                      setErrors(prev => ({ ...prev, video_file: '' }));
                    }
                    setIsUploading(false);
                  }}
                  onUploadProgress={(progress) => {
                    setUploadProgress(progress);
                    setIsUploading(progress < 100);
                  }}
                  onError={(errorMsg) => {
                    setErrors(prev => ({ ...prev, video_file: errorMsg }));
                    setIsUploading(false);
                  }}
                  maxSize={100 * 1024 * 1024} // 100MB
                  acceptedFormats="video/mp4,video/webm,video/avi"
                />
                
                {form.video_file && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{form.video_file.name}</p>
                        <p className="text-xs text-gray-500">{form.video_file.size ? `${Math.round(form.video_file.size / 1024 / 1024 * 10) / 10} MB` : ''}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setForm(prev => ({ ...prev, video_file: null }));
                          setUploadProgress(0);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                )}
                
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
                
                {errors.video_file && (
                  <p className="mt-1 text-sm text-red-600">{errors.video_file}</p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Thumbnail (Optional)
                </label>
                {video.thumbnail_url && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current thumbnail:</p>
                    <img
                      src={video.thumbnail_url}
                      alt="Current thumbnail"
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  {form.thumbnail_file ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{form.thumbnail_file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('thumbnail_file', null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Drop your thumbnail image here or</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        Choose Image
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect('thumbnail', file);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Info/Error Display */}
          {errors.general ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-red-500 text-sm">{errors.general}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <p className="text-blue-500 text-sm">You can update the video information without uploading a new video file. Simply make your changes to the title, description, or other fields and click "Update Video".</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href={`/videos/${videoId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={updateVideo.isPending}
              className="min-w-[120px]"
            >
              {updateVideo.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Video
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}