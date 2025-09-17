'use client';

import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Extend the File interface to include objectURL property
declare global {
  interface File {
    objectURL?: string;
  }
}

interface VideoUploaderProps {
  onUploadComplete: (fileUrl: string, file: File) => void;
  onUploadProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  className?: string;
  maxSize?: number; // in bytes, default 100MB
  maxSizeMB?: number; // in MB, alternative to maxSize
  acceptedFormats?: string; // default video/*
  acceptedFileTypes?: string[]; // alternative to acceptedFormats
}

const VideoUploader = ({
  onUploadComplete,
  onUploadProgress,
  onError,
  className = '',
  maxSize,
  maxSizeMB = 100, // 100MB default
  acceptedFormats,
  acceptedFileTypes
}: VideoUploaderProps) => {
  // Convert maxSizeMB to bytes if provided, otherwise use maxSize or default
  const effectiveMaxSize = maxSize || (maxSizeMB * 1024 * 1024);
  // Use acceptedFileTypes if provided, otherwise use acceptedFormats or default
  const effectiveAcceptedFormats = acceptedFileTypes?.join(',') || acceptedFormats || 'video/*';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError('');
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > effectiveMaxSize) {
      const errorMsg = `File is too large. Maximum size is ${formatFileSize(effectiveMaxSize)}`;
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      const errorMsg = 'Please select a valid video file';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File | null) => {
    setError('');
    
    if (!file) {
      resetState();
      return;
    }

    if (validateFile(file)) {
      setSelectedFile(file);
      uploadFile(file);
    }
  }, []);

  const uploadFile = async (file: File) => {
    // Check if the file is already uploaded (has an object URL)
    if (file.objectURL) {
      // If the file already has an objectURL, use it directly without re-uploading
      setUploadProgress(100);
      onUploadProgress?.(100);
      setIsUploading(false);
      onUploadComplete(file.objectURL, file);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);

    // For demo purposes, simulate upload progress
    // In a real implementation, this would be an actual API call
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress <= 100) {
          setUploadProgress(progress);
          onUploadProgress?.(progress);
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Simulate a successful upload response
          const mockFileUrl = URL.createObjectURL(file);
          // Store the objectURL on the file object for future reference
          file.objectURL = mockFileUrl;
          onUploadComplete(mockFileUrl, file);
        }
      }, 300);
    };
    
    // Comment out the actual API call for demo purposes
    // In a real implementation, uncomment this code and remove the simulation
    /*
    const formData = new FormData();
    formData.append('video_file', file);

    try {
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
            onUploadProgress?.(progress);
          }
        },
      });

      setIsUploading(false);
      setUploadProgress(100);
      
      // Call the callback with the uploaded file URL
      onUploadComplete(response.data.file_url, file);
    } catch (err) {
      setIsUploading(false);
      const errorMsg = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Failed to upload video. Please try again.';
      
      setError(errorMsg);
      onError?.(errorMsg);
    }
    */
    
    // Start the upload simulation
    simulateUpload();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-300' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium">{selectedFile.name}</span>
              {!isUploading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileSelect(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatFileSize(selectedFile.size)}
            </p>
            
            {/* Progress bar */}
            {isUploading && (
              <div className="w-full mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600">Drop your video file here, or</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Browse Files
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supports MP4, WebM, AVI (Max {formatFileSize(effectiveMaxSize)})
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={effectiveAcceptedFormats}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default VideoUploader;