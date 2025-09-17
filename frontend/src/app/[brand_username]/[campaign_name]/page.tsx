'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Copy, Check } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
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

export default function CampaignPlayerPage() {
  const params = useParams();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const { brand_username, campaign_name } = params;

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
    if (brand_username && campaign_name) {
      fetchCampaignVideo();
    }
  }, [brand_username, campaign_name]);

  // Close share tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showShareTooltip && !target.closest('.share-container')) {
        setShowShareTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareTooltip]);

  // Remove the timer to show CTA - we'll show it only at the end of the video

  const getShareableLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareClick = () => {
    setShowShareTooltip(!showShareTooltip);
  };

  const handleCTAClick = () => {
    if (videoData?.cta_url) {
      window.open(videoData.cta_url, '_blank');
    }
  };

  const handleVideoEnded = () => {
    // Show CTA button when video ends
    setShowCTA(true);
  };

  if (loading) {
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Toast notifications */}
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 flex flex-col">
          {/* Video Title and Share Button */}
          <div className="p-4 bg-black flex justify-between items-center">
            <h1 className="text-2xl font-bold text-center flex-grow">{videoData?.title}</h1>
            <div className="relative share-container">
              <button 
                onClick={handleShareClick}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Share video"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              
              {showShareTooltip && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg p-4 z-20">
                  <div className="text-sm font-medium text-white mb-2">Share this video:</div>
                  <div className="flex items-center gap-2 bg-gray-700 rounded p-2">
                    <input 
                      type="text" 
                      value={getShareableLink()} 
                      readOnly 
                      className="bg-transparent text-white text-sm flex-grow outline-none"
                    />
                    <button 
                      onClick={copyToClipboard} 
                      className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Video Player */}
          <div className="relative w-full h-screen bg-black overflow-hidden">
            {videoData && (
              <video
                ref={(el) => setVideoElement(el)}
                src={`${STORAGE_BASE_URL}/${videoData.file_path}`}
                className="w-full h-full object-contain"
                autoPlay
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
              />
            )}

            {/* CTA Button */}
            {showCTA && (
              <div className="absolute bottom-20 right-10 z-10">
                <button
                  onClick={handleCTAClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {videoData.cta_text || 'Start Choosing'}
                </button>
              </div>
            )}

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}