'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL, STORAGE_BASE_URL } from '@/lib/config';

interface VideoData {
  id: number;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  duration: number;
  cta_text: string;
  cta_url: string;
  slug: string;
}

interface CampaignData {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    campaign: CampaignData;
    video: VideoData;
    total_videos: number;
    current_index: number;
  };
  message?: string;
}

export default function TechCorpSummerSalePage() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const brand_username = 'techcorp';
  const campaign_name = 'summer-sale-2024';

  const fetchCampaignVideo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/public/${brand_username}/${campaign_name}`
      );
      const data: ApiResponse = await response.json();

      if (data.success) {
        setVideoData(data.data.video);
        setCampaignData(data.data.campaign);
        setTotalVideos(data.data.total_videos);
        setCurrentIndex(data.data.current_index);
        setShowCTA(false); // Reset CTA for new video
      } else {
        setError(data.message || 'Campaign not found');
      }
    } catch (err) {
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignVideo();
  }, []);

  // Remove the timer to show CTA - we'll show it only at the end of the video

  const handleCTAClick = () => {
    if (videoData?.cta_url) {
      window.open(videoData.cta_url, '_blank');
    }
  };

  const handleVideoEnded = () => {
    // Show CTA button when video ends
    setShowCTA(true);
  };

  if (loading && !videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading campaign...</div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-screen flex flex-col items-center">
        {/* Video Title */}
        <div className="text-white text-center py-4">
          <h1 className="text-2xl font-bold">{videoData.title}</h1>
        </div>
        
        {/* Video Player */}
        <div className="relative w-full max-w-4xl flex-grow">
          <video
            ref={setVideoElement}
            key={videoData.id}
            className="w-full h-full object-contain"
            poster={videoData.thumbnail_path ? `${STORAGE_BASE_URL}/${videoData.thumbnail_path}` : undefined}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideoEnded}
            autoPlay
            controls
            playsInline
          >
            <source src={`${STORAGE_BASE_URL}/${videoData.file_path}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* CTA Button - Show only at the end of video */}
          {showCTA && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 animate-pulse"
              >
                {videoData.cta_text || 'Start Choosing'}
              </button>
            </div>
          )}
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-lg">Loading video...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}