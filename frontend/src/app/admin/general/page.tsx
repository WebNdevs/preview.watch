'use client';

import { useState, useEffect, useRef } from 'react';
import { Video } from '@/types';
import api from '@/lib/api';

export default function AdminGeneralPage() {
  const [video, setVideo] = useState<Video | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoElement = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Set auth token from auth_response.json for testing
    if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', '12|RhU3WGN0OTkvJsRw9rMBHsW0ne6av72gBHxwKdbt58df1e2e');
    }
    
    const fetchCampaignVideos = async () => {
      try {
        setLoading(true);
        // Use the campaigns endpoint with authentication
        const response = await api.get('/campaigns/6');
        
        if (response.data && response.data.data && response.data.data.videos) {
          const availableVideos = response.data.data.videos;
          
          if (availableVideos.length > 0) {
            // Get a random video from the available videos
            const randomIndex = Math.floor(Math.random() * availableVideos.length);
            const selectedVideo = availableVideos[randomIndex];
            
            setVideo(selectedVideo);
          } else {
            setError('No videos found in this campaign');
          }
        } else {
          setError('No campaign data found');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignVideos();
  }, []);

  // Handle video ended event to show CTA and Reply buttons
  const handleVideoEnded = () => {
    setVideoEnded(true);
  };
  
  // Handle replay button click to restart the video
  const handleReplayClick = () => {
    if (videoElement.current) {
      videoElement.current.currentTime = 0;
      videoElement.current.play();
      setVideoEnded(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player - No Title */}
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {video && (
          <>
            <video
              ref={videoElement}
              src={video.file_url || video.file_path}
              className="w-full h-full object-contain"
              autoPlay
              controls
              onEnded={handleVideoEnded}
            />
            
            {/* CTA and Reply buttons - shown only when video ends */}
            {videoEnded && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-black/80 rounded-lg flex flex-col gap-4 items-center">
                {/* CTA Button */}
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
                >
                  {video.cta_text || 'Learn More'}
                </button>
                
                {/* Reply Icon */}
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
                  onClick={handleReplayClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-xl">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
}