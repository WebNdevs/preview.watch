'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { DOMAIN, API_BASE_URL, STORAGE_BASE_URL } from '@/lib/config';


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
  views: number;
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
  };
  message?: string;
}

export default function VideoPlayerPage() {
  const params = useParams();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const { brand_username, campaign_name, video_name } = params;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public/${brand_username}/${campaign_name}/${video_name}`
        );
        const data: ApiResponse = await response.json();

        if (data.success) {
          setVideoData(data.data.video);
          setCampaignData(data.data.campaign);
        } else {
          setError(data.message || 'Video not found');
        }
      } catch (err) {
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (brand_username && campaign_name && video_name) {
      fetchVideo();
    }
  }, [brand_username, campaign_name, video_name]);

  useEffect(() => {
    if (videoElement) {
      // Show CTA button after 5 seconds
      const ctaTimer = setTimeout(() => {
        setShowCTA(true);
      }, 5000);

      return () => clearTimeout(ctaTimer);
    }
  }, [videoElement, isPlaying]);

  const togglePlay = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoElement.requestFullscreen();
      }
    }
  };

  const handleCTAClick = () => {
    if (videoData?.cta_url) {
      window.open(videoData.cta_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-screen">
        <video
          ref={setVideoElement}
          className="w-full h-full object-contain"
          poster={videoData.thumbnail_path ? `${STORAGE_BASE_URL}/${videoData.thumbnail_path}` : undefined}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          autoPlay
          playsInline
        >
          <source src={`${STORAGE_BASE_URL}/${videoData.file_path}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {showCTA && videoData.cta_text && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={handleCTAClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              {videoData.cta_text}
            </button>
          </div>
        )}

        {/* Video Info Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
            <p className="text-gray-300 mb-1">{campaignData?.name}</p>
            <p className="text-gray-400 text-sm">{videoData.views} views</p>
          </div>
        </div>
      </div>

      {/* Video Description */}
      {videoData.description && (
        <div className="bg-gray-900 text-white p-6">
          <h2 className="text-xl font-semibold mb-3">About this video</h2>
          <p className="text-gray-300 leading-relaxed">{videoData.description}</p>
        </div>
      )}
    </div>
  );
}