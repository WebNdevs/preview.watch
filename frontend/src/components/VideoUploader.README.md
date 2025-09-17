# VideoUploader Component

A reusable React component for handling video uploads with progress tracking, built with React, Axios, and Tailwind CSS.

## Features

- Immediate upload on file selection
- Real-time upload progress tracking with percentage display
- Drag and drop support
- File validation (size and type)
- Error handling
- Clean UI with Tailwind CSS styling
- Fully customizable

## Usage

### Basic Usage

```tsx
import VideoUploader from '@/components/VideoUploader';

function MyForm() {
  const handleUploadComplete = (fileUrl: string, file: File) => {
    console.log('Upload complete:', fileUrl);
    // Store the URL in your form state
  };

  return (
    <form>
      <VideoUploader 
        onUploadComplete={handleUploadComplete}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Progress Tracking

```tsx
import { useState } from 'react';
import VideoUploader from '@/components/VideoUploader';

function MyFormWithProgress() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleUploadComplete = (fileUrl: string, file: File) => {
    setVideoUrl(fileUrl);
    setIsUploading(false);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setIsUploading(progress < 100);
  };

  return (
    <form>
      <VideoUploader 
        onUploadComplete={handleUploadComplete}
        onUploadProgress={handleUploadProgress}
        onError={(error) => console.error(error)}
      />
      
      {isUploading && (
        <div>
          <p>Upload Progress: {uploadProgress}%</p>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!videoUrl || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUploadComplete` | `(fileUrl: string, file: File) => void` | Required | Callback function called when upload completes successfully |
| `onUploadProgress` | `(progress: number) => void` | Optional | Callback function for tracking upload progress (0-100) |
| `onError` | `(error: string) => void` | Optional | Callback function for handling upload errors |
| `className` | `string` | `''` | Additional CSS classes to apply to the component |
| `maxSize` | `number` | `100 * 1024 * 1024` (100MB) | Maximum file size in bytes |
| `acceptedFormats` | `string` | `'video/*'` | Accepted file formats (MIME types) |

## Backend Integration

This component expects a backend endpoint at `/api/videos/upload` that:

1. Accepts a `multipart/form-data` POST request
2. Processes the uploaded file (named `video_file` in the FormData)
3. Returns a JSON response with the uploaded file URL:

```json
{
  "file_url": "https://example.com/path/to/video.mp4"
}
```

## Example Implementation

See the `VideoUploadForm.tsx` component for a complete example of how to integrate the VideoUploader into a form with validation and submission handling.

You can also check out the example page at `/examples/video-upload` to see the component in action.